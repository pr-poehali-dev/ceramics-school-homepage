CREATE TABLE t_p90609946_ceramics_school_home.shipment_photos (
  id SERIAL PRIMARY KEY,
  shipment_id INTEGER NOT NULL REFERENCES t_p90609946_ceramics_school_home.shipments(id),
  photo_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shipment_photos_shipment_id ON t_p90609946_ceramics_school_home.shipment_photos(shipment_id);

INSERT INTO t_p90609946_ceramics_school_home.shipment_photos (shipment_id, photo_url, sort_order)
SELECT id, photo_url, 0
FROM t_p90609946_ceramics_school_home.shipments
WHERE photo_url IS NOT NULL AND photo_url != '';
