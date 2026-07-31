CREATE TABLE t_p90609946_ceramics_school_home.gift_hints (
    id SERIAL PRIMARY KEY,
    sender_name VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    recipient_email VARCHAR(255) NULL,
    recipient_contact VARCHAR(500) NULL,
    gift_type VARCHAR(20) NOT NULL,
    gift_slug VARCHAR(150) NULL,
    gift_label VARCHAR(255) NOT NULL,
    message TEXT NULL,
    consent BOOLEAN NOT NULL DEFAULT false,
    email_sent BOOLEAN NOT NULL DEFAULT false,
    email_error TEXT NULL,
    city VARCHAR(20) NOT NULL DEFAULT 'moscow',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE t_p90609946_ceramics_school_home.gift_hints IS
  'Заявки формы "Намекнуть на подарок" — клиент отправляет близкому письмо-намёк на подарок (мастер-класс или сертификат)';