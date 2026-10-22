-- SAFARI tri-role hardening.
-- 1. Signup always grants 'tourist'; privileged roles are admin-assigned only.
-- 2. Role-aware policies accept both legacy (user/hotel/support) and modern (tourist/operator/admin) role names.
-- 3. Ownership stays locked: WITH CHECK on hotels and bookings updates prevents moving rows to another owner.

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    NEW.email
  );

  -- Public signups are always customers. Partner/admin/ranger/researcher
  -- roles are granted only through the admin assignment flow.
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'tourist'::public.app_role);

  INSERT INTO public.platform_events(domain, name, aggregate_id, actor_id, payload)
  VALUES (
    'identity', 'user.registered', NEW.id, NEW.id,
    jsonb_build_object('email', NEW.email, 'role', 'tourist')
  );

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id uuid)
 RETURNS SETOF app_role
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT role FROM public.user_roles
  WHERE user_id = _user_id
    AND (auth.uid() = _user_id
         OR public.has_role(auth.uid(), 'support'::app_role)
         OR public.has_role(auth.uid(), 'admin'::app_role));
$function$;

-- hotels: partner write paths keep ownership AND add WITH CHECK.
DROP POLICY IF EXISTS "Hotel partners create own" ON public.hotels;
CREATE POLICY "Hotel partners create own" ON public.hotels
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = owner_id
    AND (public.has_role(auth.uid(), 'hotel'::app_role)
         OR public.has_role(auth.uid(), 'operator'::app_role)
         OR public.has_role(auth.uid(), 'support'::app_role)
         OR public.has_role(auth.uid(), 'admin'::app_role))
  );

DROP POLICY IF EXISTS "Hotel partners update own" ON public.hotels;
CREATE POLICY "Hotel partners update own" ON public.hotels
  FOR UPDATE TO authenticated
  USING (
    auth.uid() = owner_id
    OR public.has_role(auth.uid(), 'support'::app_role)
    OR public.has_role(auth.uid(), 'admin'::app_role)
  )
  WITH CHECK (
    auth.uid() = owner_id
    OR public.has_role(auth.uid(), 'support'::app_role)
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );

DROP POLICY IF EXISTS "Hotel partners delete own" ON public.hotels;
CREATE POLICY "Hotel partners delete own" ON public.hotels
  FOR DELETE TO authenticated
  USING (
    auth.uid() = owner_id
    OR public.has_role(auth.uid(), 'support'::app_role)
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );

-- bookings: mirror the row access as WITH CHECK so user_id cannot be reassigned.
DROP POLICY IF EXISTS "Users update own bookings" ON public.bookings;
CREATE POLICY "Users update own bookings" ON public.bookings
  FOR UPDATE TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.hotels h
      WHERE h.id = bookings.hotel_id AND h.owner_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'support'::app_role)
    OR public.has_role(auth.uid(), 'admin'::app_role)
  )
  WITH CHECK (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.hotels h
      WHERE h.id = bookings.hotel_id AND h.owner_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'support'::app_role)
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );

-- profiles: owner read/update; platform admin recognised alongside legacy support.
DROP POLICY IF EXISTS "Profiles owner or support read" ON public.profiles;
CREATE POLICY "Profiles owner or support read" ON public.profiles
  FOR SELECT
  USING (
    auth.uid() = id
    OR public.has_role(auth.uid(), 'support'::app_role)
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );

DROP POLICY IF EXISTS "Support delete profile" ON public.profiles;
CREATE POLICY "Support delete profile" ON public.profiles
  FOR DELETE TO authenticated
  USING (
    public.has_role(auth.uid(), 'support'::app_role)
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );

-- user_roles: role writes restricted to platform admin (legacy support or modern admin).
DROP POLICY IF EXISTS "Support manage roles" ON public.user_roles;
CREATE POLICY "Support manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), 'support'::app_role)
    OR public.has_role(auth.uid(), 'admin'::app_role)
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'support'::app_role)
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );