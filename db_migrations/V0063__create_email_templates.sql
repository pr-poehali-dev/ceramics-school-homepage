CREATE TABLE IF NOT EXISTS t_p90609946_ceramics_school_home.email_templates (
    template_key VARCHAR(64) PRIMARY KEY,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);