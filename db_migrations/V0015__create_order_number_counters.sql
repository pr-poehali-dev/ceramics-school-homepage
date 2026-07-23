CREATE TABLE IF NOT EXISTS t_p90609946_ceramics_school_home.order_number_counters (
    year_month VARCHAR(4) PRIMARY KEY,
    counter INTEGER NOT NULL DEFAULT 0
);
COMMENT ON TABLE t_p90609946_ceramics_school_home.order_number_counters IS 'Счётчик порядковых номеров заказов по месяцам для формата ГГММ/N';