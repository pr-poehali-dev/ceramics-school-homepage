INSERT INTO t_p90609946_ceramics_school_home.order_number_counters (year_month, counter)
VALUES ('2607', 21)
ON CONFLICT (year_month) DO UPDATE SET counter = GREATEST(order_number_counters.counter, EXCLUDED.counter);