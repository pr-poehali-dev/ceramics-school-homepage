UPDATE t_p90609946_ceramics_school_home.shipments
SET status = 'rejected'
WHERE tracking_number IN ('REQ-6B6364', 'REQ-3D5742') AND status != 'rejected';