CREATE TABLE IF NOT EXISTS t_p90609946_ceramics_school_home.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO t_p90609946_ceramics_school_home.site_settings (key, value)
VALUES (
    'announcement_banner',
    '{"enabled": false, "text": "Уважаемые покупатели! В период с 8.01 по 10.01 школа керамики работает только на прием заказов через корзину. С 11 января работа в штатном режиме. Приносим свои извинения!"}'::jsonb
)
ON CONFLICT (key) DO NOTHING;