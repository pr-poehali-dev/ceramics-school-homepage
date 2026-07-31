ALTER TABLE t_p90609946_ceramics_school_home.shipments
  ADD COLUMN visit_date DATE NULL;

COMMENT ON COLUMN t_p90609946_ceramics_school_home.shipments.visit_date IS
  'Дата, когда клиент посетил мастер-класс/студию (указывается клиентом в форме заявки на сайте)';