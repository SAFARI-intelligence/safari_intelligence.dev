DROP POLICY IF EXISTS "Hotel partners update own images" ON storage.objects;
CREATE POLICY "Hotel partners update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'hotel-images'
  AND (auth.uid())::text = (storage.foldername(name))[1]
  AND (public.has_role(auth.uid(), 'hotel'::app_role) OR public.has_role(auth.uid(), 'support'::app_role))
)
WITH CHECK (
  bucket_id = 'hotel-images'
  AND (auth.uid())::text = (storage.foldername(name))[1]
  AND (public.has_role(auth.uid(), 'hotel'::app_role) OR public.has_role(auth.uid(), 'support'::app_role))
);