UPDATE t_p90609946_ceramics_school_home.shipments
SET delivered_at = CURRENT_DATE, pickup_reminder_sent_at = NULL
WHERE id = 169;