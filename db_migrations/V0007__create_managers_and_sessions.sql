CREATE TABLE IF NOT EXISTS managers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS manager_sessions (
    id SERIAL PRIMARY KEY,
    manager_id INTEGER NOT NULL REFERENCES managers(id),
    token VARCHAR(64) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_manager_sessions_token ON manager_sessions(token);
CREATE INDEX IF NOT EXISTS idx_manager_sessions_expires ON manager_sessions(expires_at);

INSERT INTO managers (email, password_hash, name)
VALUES ('ryabokon.irina@dymovceramic.ru', 'pbkdf2_sha256$100000$bf8f41b352a48f7da0d17b61bddecfa1$6d95caa229bc18db9632c8bdb47d57bbe96be22c94edcae2cfb5b1b3b2b592a1', 'Ирина')
ON CONFLICT (email) DO NOTHING;