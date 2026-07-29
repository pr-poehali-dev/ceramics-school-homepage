INSERT INTO t_p90609946_ceramics_school_home.shipments
  (tracking_number, customer_name, customer_phone, customer_email, photo_url, delivered_at, return_at, status, source, visit_number, parent_id, created_at)
VALUES
  ('REQ-DEMO01', 'Тестова Мария Ивановна', '+7 (999) 000-11-22', 'demo-client@example.com',
   'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/shipment-requests/2119d57ada26091bf77f715f.jpg',
   CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '25 days', 'shipped', 'client', 1, NULL, NOW() - INTERVAL '5 days');

INSERT INTO t_p90609946_ceramics_school_home.shipments
  (tracking_number, customer_name, customer_phone, customer_email, photo_url, delivered_at, return_at, status, source, visit_number, parent_id, created_at)
VALUES
  ('REQ-DEMO02', 'Тестова Мария Ивановна', '+7 (999) 000-11-22', 'demo-client@example.com',
   'https://cdn.poehali.dev/projects/b241161a-f0d6-42a2-9d30-83e375a0753b/bucket/shipment-requests/95b6150939688c6301e616fd.png',
   CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'shipped', 'client', 2,
   (SELECT id FROM t_p90609946_ceramics_school_home.shipments WHERE tracking_number = 'REQ-DEMO01'), NOW());
