-- Откат тестовых отметок готовности, сделанных при диагностике отправки письма
UPDATE t_p90609946_ceramics_school_home.shipments
SET ready_at = NULL
WHERE id IN (3, 8) AND tracking_number IN ('REQ-EE3F65', 'REQ-3D5742');