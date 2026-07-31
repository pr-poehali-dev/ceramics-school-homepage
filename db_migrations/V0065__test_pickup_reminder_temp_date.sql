UPDATE t_p90609946_ceramics_school_home.shipments
SET delivered_at = CURRENT_DATE - INTERVAL '15 days'
WHERE id = 169;