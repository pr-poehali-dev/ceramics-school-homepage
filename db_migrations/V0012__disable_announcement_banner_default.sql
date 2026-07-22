UPDATE t_p90609946_ceramics_school_home.site_settings
SET value = jsonb_set(value, '{enabled}', 'false'::jsonb), updated_at = NOW()
WHERE key = 'announcement_banner';