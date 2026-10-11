-- Rollback for rls-amend-001. Restores the exact prior policies.
BEGIN;
DROP POLICY IF EXISTS "user_roles_admin_manage" ON public.user_roles;
CREATE POLICY "Support manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'support')) WITH CHECK (public.has_role(auth.uid(),'support'));
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, public;

DROP POLICY IF EXISTS "hotels_operator_delete_own" ON public.hotels;
CREATE POLICY "Hotel partners delete own" ON public.hotels FOR DELETE TO authenticated
  USING ((auth.uid() = owner_id) OR public.has_role(auth.uid(),'support'));
DROP POLICY IF EXISTS "hotels_operator_insert_own" ON public.hotels;
CREATE POLICY "Hotel partners create own" ON public.hotels FOR INSERT TO authenticated
  WITH CHECK ((auth.uid() = owner_id) AND (public.has_role(auth.uid(),'hotel') OR public.has_role(auth.uid(),'support')));
DROP POLICY IF EXISTS "hotels_admin_update" ON public.hotels;
DROP POLICY IF EXISTS "hotels_operator_update_own" ON public.hotels;
CREATE POLICY "Hotel partners update own" ON public.hotels FOR UPDATE TO authenticated
  USING ((auth.uid() = owner_id) OR public.has_role(auth.uid(),'support'));
COMMIT;
