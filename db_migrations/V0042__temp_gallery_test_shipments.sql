INSERT INTO t_p90609946_ceramics_school_home.shipments
  (tracking_number, customer_name, customer_phone, customer_email, photo_url, delivered_at, return_at, status, source, visit_number, requires_painting, created_at)
VALUES
  ('REQ-GALTEST1', 'Иванова Мария', '+7 (999) 111-22-33', 'gal1@test.ru',
   'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/shipment-requests/2119d57ada26091bf77f715f.jpg',
   CURRENT_DATE, CURRENT_DATE + 30, 'shipped', 'client', 1, false, NOW()),
  ('REQ-GALTEST2', 'Петров Иван', '+7 (999) 222-33-44', 'gal2@test.ru',
   'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/shipment-requests/95b6150939688c6301e616fd.png',
   CURRENT_DATE, CURRENT_DATE + 30, 'shipped', 'client', 1, false, NOW()),
  ('REQ-GALTEST3', 'Сидорова Анна', '+7 (999) 333-44-55', 'gal3@test.ru',
   'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/shipment-requests/b900c84d9c06140e172f9b9b.png',
   CURRENT_DATE, CURRENT_DATE + 30, 'shipped', 'client', 1, false, NOW());
