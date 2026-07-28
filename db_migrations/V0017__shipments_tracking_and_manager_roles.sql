-- Роль менеджера: 'vdnh' (существующие менеджеры) или 'suzdal' (новая роль для добавления посылок)
ALTER TABLE managers ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'vdnh';

-- Существующие 2 менеджера — это менеджеры ВДНХ/Москвы (роль по умолчанию 'vdnh')

-- Таблица посылок с готовыми керамическими изделиями
CREATE TABLE IF NOT EXISTS shipments (
    id SERIAL PRIMARY KEY,
    tracking_number VARCHAR(100) NOT NULL UNIQUE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    delivered_at DATE NOT NULL,
    return_at DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'shipped',
    issued_at TIMESTAMP NULL,
    issued_by INTEGER NULL REFERENCES managers(id),
    created_by INTEGER NULL REFERENCES managers(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shipments_phone ON shipments(customer_phone);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON shipments(tracking_number);

-- Новый менеджер Суздаля
INSERT INTO managers (email, password_hash, name, role)
VALUES ('kolesnikov.denis@dymovceramic.ru', 'pbkdf2_sha256$100000$4cf0853c0ddcc49555d0aeb2054b31a8$2401487778dbc9dab520bda88bee97677b2bb8790e01f41b85479feb85136566', 'Денис Колесников', 'suzdal')
ON CONFLICT (email) DO NOTHING;
