INSERT INTO t_p90609946_ceramics_school_home.manager_sessions (manager_id, token, expires_at)
VALUES (1, 'restore-check-token-1234567890abcdef1234', NOW() + INTERVAL '30 minutes')
ON CONFLICT DO NOTHING;