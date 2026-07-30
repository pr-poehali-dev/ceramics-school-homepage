UPDATE t_p90609946_ceramics_school_home.custom_workshops
SET hidden = true
WHERE slug = 'rospis-izrazcov-test';

UPDATE t_p90609946_ceramics_school_home.manager_sessions
SET expires_at = NOW() - INTERVAL '1 hour'
WHERE token IN ('restore-check-token-1234567890abcdef1234', 'workshop-e2e-test-token-abcdef1234567890abc');