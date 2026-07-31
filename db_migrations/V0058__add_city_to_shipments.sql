ALTER TABLE t_p90609946_ceramics_school_home.shipments
    ADD COLUMN city VARCHAR(20) NOT NULL DEFAULT 'moscow';

UPDATE t_p90609946_ceramics_school_home.shipments
    SET city = 'suzdal'
    WHERE source = 'manager';

CREATE INDEX idx_shipments_city ON t_p90609946_ceramics_school_home.shipments(city);

COMMENT ON COLUMN t_p90609946_ceramics_school_home.shipments.city IS
  'Город, к которому относится заявка/посылка: moscow или suzdal. Для старых записей менеджера Суздаля (source=manager) проставлено suzdal при миграции.';