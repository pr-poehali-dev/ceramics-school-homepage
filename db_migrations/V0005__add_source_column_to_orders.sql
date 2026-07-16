ALTER TABLE orders ADD COLUMN IF NOT EXISTS source VARCHAR(20) NOT NULL DEFAULT 'site';
CREATE INDEX IF NOT EXISTS idx_orders_source ON orders(source);
COMMENT ON COLUMN orders.source IS 'Источник заказа: site — новый заказ с сайта, legacy_import — перенесён из старой системы';