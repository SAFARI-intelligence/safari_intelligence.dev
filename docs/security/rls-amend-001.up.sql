-- PROPOSAL ONLY — do not apply without human review.
-- Amends existing hotels + user_roles policies. Single transaction.
-- Untouched: animal_locations, pay_*, money columns, agents.*.
BEGIN;

-- hotels: owner must hold operator role (legacy 'hotel' accepted); WITH CHECK blocks owner reassignment.
DROP POLICY IF EXISTS "Hotel partners update own" ON public.hotels;
CREATE POLICY "hotels_operator_update_own" ON public.hotels
  FOR UPDATE TO authenticated
  USING (owner_id = auth.uid() AND (public.has_role(auth.uid(),'operator') OR public.has_role(auth.uid(),'hotel')))
  WITH CHECK (owner_id = auth.uid() AND (public.has_role(auth.uid(),'operator') OR public.has_role(auth.uid(),'hotel')));
CREATE POLICY "hotels_admin_update" ON public.hotels
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'support'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'support'));

DROP POLICY IF EXISTS "Hotel partners create own" ON public.hotels;
CREATE POLICY "hotels_operator_insert_own" ON public.hotels
  FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid() AND (public.has_role(auth.uid(),'operator') OR public.has_role(auth.uid(),'hotel')
    OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'support')));

DROP POLICY IF EXISTS "Hotel partners delete own" ON public.hotels;
CREATE POLICY "hotels_operator_delete_own" ON public.hotels
  FOR DELETE TO authenticated
  USING ((owner_id = auth.uid() AND (public.has_role(auth.uid(),'operator') OR public.has_role(auth.uid(),'hotel')))
    OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'support'));

-- Public read policy is unchanged (published OR owner OR support) — anonymous browsing preserved.

-- user_roles: only admins manage roles (legacy 'support' maps to admin).
-- The existing prevent_support_self_escalation trigger still blocks non-admins from granting admin/support.
DROP POLICY IF EXISTS "Support manage roles" ON public.user_roles;
CREATE POLICY "user_roles_admin_manage" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'support'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'support'));
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

COMMIT;
