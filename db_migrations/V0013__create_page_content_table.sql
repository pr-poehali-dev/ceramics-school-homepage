CREATE TABLE IF NOT EXISTS t_p90609946_ceramics_school_home.page_content (
    page_key TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    fields JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);