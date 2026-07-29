CREATE TABLE IF NOT EXISTS t_p90609946_ceramics_school_home.custom_workshops (
    id SERIAL PRIMARY KEY,
    city VARCHAR(20) NOT NULL CHECK (city IN ('moscow', 'suzdal')),
    slug VARCHAR(150) NOT NULL,
    label VARCHAR(255) NOT NULL,
    badge_icon VARCHAR(50) NOT NULL DEFAULT 'Sparkles',
    hidden BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_by INTEGER NULL REFERENCES t_p90609946_ceramics_school_home.managers(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (city, slug)
);

CREATE INDEX IF NOT EXISTS idx_custom_workshops_city ON t_p90609946_ceramics_school_home.custom_workshops(city);
