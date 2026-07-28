-- Добавляем возможность самостоятельной подачи заявки клиентом с фото изделия
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255) NULL;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS photo_url TEXT NULL;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS source VARCHAR(20) NOT NULL DEFAULT 'manager';

CREATE INDEX IF NOT EXISTS idx_shipments_source ON shipments(source);
