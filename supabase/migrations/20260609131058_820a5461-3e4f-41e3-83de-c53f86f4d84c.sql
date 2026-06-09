CREATE OR REPLACE FUNCTION public.prevent_support_self_escalation()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.role = 'support'::app_role THEN
    IF auth.uid() IS NOT NULL THEN
      RAISE EXCEPTION 'Assigning the support role via API is not permitted';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;