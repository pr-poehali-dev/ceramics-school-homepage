ALTER TABLE t_p90609946_ceramics_school_home.shipments
  ADD COLUMN IF NOT EXISTS requires_painting BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE t_p90609946_ceramics_school_home.shipments
  ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP NULL;
ALTER TABLE t_p90609946_ceramics_school_home.shipments
  ADD COLUMN IF NOT EXISTS painting_reminder_sent_at TIMESTAMP NULL;
