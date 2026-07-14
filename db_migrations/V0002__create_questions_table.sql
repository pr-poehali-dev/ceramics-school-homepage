CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    phone VARCHAR(50),
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);