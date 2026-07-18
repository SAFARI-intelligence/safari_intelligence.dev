
-- 1. Extend app_role enum (additive; existing values kept for compatibility)
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'tourist';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'operator';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'ranger';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'researcher';

-- Enum value additions must be committed before values can be used in DML.
COMMIT;

-- 2. Backfill legacy role rows to new semantic values (idempotent)
UPDATE public.user_roles SET role = 'tourist'::public.app_role  WHERE role = 'user'::public.app_role;
UPDATE public.user_roles SET role = 'operator'::public.app_role WHERE role = 'hotel'::public.app_role;
UPDATE public.user_roles SET role = 'admin'::public.app_role    WHERE role = 'support'::public.app_role;

-- 3. platform_events (event bus append log)
CREATE TABLE IF NOT EXISTS public.platform_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text NOT NULL,
  name text NOT NULL,
  aggregate_id uuid,
  actor_id uuid,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS platform_events_domain_name_idx ON public.platform_events(domain, name, occurred_at DESC);
CREATE INDEX IF NOT EXISTS platform_events_aggregate_idx  ON public.platform_events(aggregate_id, occurred_at DESC);

GRANT SELECT ON public.platform_events TO authenticated;
GRANT ALL    ON public.platform_events TO service_role;
ALTER TABLE public.platform_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read platform events"
  ON public.platform_events FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 4. identity_audit_log
CREATE TABLE IF NOT EXISTS public.identity_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  actor_id uuid,
  action text NOT NULL,
  ip text,
  user_agent text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS identity_audit_user_idx ON public.identity_audit_log(user_id, occurred_at DESC);

GRANT SELECT ON public.identity_audit_log TO authenticated;
GRANT ALL    ON public.identity_audit_log TO service_role;
ALTER TABLE public.identity_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own audit rows"
  ON public.identity_audit_log FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role));

-- 5. Harden handle_new_user: default 'tourist', block admin self-assignment,
-- emit identity.user.registered event.
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _role public.app_role;
  _requested text;
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    NEW.email
  );

  _requested := NEW.raw_user_meta_data ->> 'role';
  -- Legacy compatibility mapping
  IF _requested = 'user'    THEN _requested := 'tourist';  END IF;
  IF _requested = 'hotel'   THEN _requested := 'operator'; END IF;
  IF _requested = 'support' THEN _requested := 'admin';    END IF;

  BEGIN
    _role := COALESCE(_requested::public.app_role, 'tourist'::public.app_role);
  EXCEPTION WHEN others THEN
    _role := 'tourist'::public.app_role;
  END;

  -- Admin is never self-assignable at signup
  IF _role = 'admin'::public.app_role THEN
    _role := 'tourist'::public.app_role;
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role);

  INSERT INTO public.platform_events(domain, name, aggregate_id, actor_id, payload)
  VALUES (
    'identity', 'user.registered', NEW.id, NEW.id,
    jsonb_build_object('email', NEW.email, 'role', _role::text)
  );

  RETURN NEW;
END;
$function$;

-- 6. Update self-escalation guard to block 'admin' (previously blocked 'support')
CREATE OR REPLACE FUNCTION public.prevent_support_self_escalation()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.role IN ('admin'::public.app_role, 'support'::public.app_role) THEN
    IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
      RAISE EXCEPTION 'Assigning the admin role via API is not permitted';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;
