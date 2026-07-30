UPDATE t_p90609946_ceramics_school_home.page_content
SET fields = fields || jsonb_build_object(
  'whatsappLink', 'https://wa.me/79151576485',
  'telegramLink', 'https://t.me/+79151576485'
), updated_at = NOW()
WHERE page_key = 'suzdal-messengers';