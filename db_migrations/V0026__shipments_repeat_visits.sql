ALTER TABLE t_p90609946_ceramics_school_home.shipments
  ADD COLUMN IF NOT EXISTS parent_id INTEGER NULL REFERENCES t_p90609946_ceramics_school_home.shipments(id);
ALTER TABLE t_p90609946_ceramics_school_home.shipments
  ADD COLUMN IF NOT EXISTS visit_number INTEGER NOT NULL DEFAULT 1;
CREATE INDEX IF NOT EXISTS idx_shipments_parent_id ON t_p90609946_ceramics_school_home.shipments(parent_id);
