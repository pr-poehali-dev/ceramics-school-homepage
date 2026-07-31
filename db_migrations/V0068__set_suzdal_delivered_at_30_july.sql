UPDATE t_p90609946_ceramics_school_home.shipments
SET delivered_at = '2026-07-30'
WHERE city = 'suzdal' AND status IN ('shipped', 'issued');