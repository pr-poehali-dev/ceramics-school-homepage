ALTER TABLE shipments ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP NULL;
CREATE INDEX IF NOT EXISTS idx_shipments_archived_at ON shipments(archived_at);