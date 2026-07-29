ALTER TABLE t_p90609946_ceramics_school_home.shipments
  ADD COLUMN IF NOT EXISTS needs_painting BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE t_p90609946_ceramics_school_home.shipments
  ADD COLUMN IF NOT EXISTS painting_notified_at TIMESTAMP NULL;
