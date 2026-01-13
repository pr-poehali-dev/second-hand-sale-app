-- Таблица для заявок на верификацию
CREATE TABLE verification_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending',
    phone VARCHAR(20),
    email VARCHAR(255),
    document_type VARCHAR(50),
    document_number VARCHAR(100),
    rejection_reason TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by INTEGER
);

CREATE INDEX idx_verification_requests_user_id ON verification_requests(user_id);
CREATE INDEX idx_verification_requests_status ON verification_requests(status);

-- Добавляем поля в таблицу users
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_level VARCHAR(20) DEFAULT 'none';
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_sales INTEGER DEFAULT 0;

-- Обновляем существующих пользователей
UPDATE users SET verification_level = CASE 
    WHEN verified = TRUE THEN 'verified'
    ELSE 'none'
END WHERE verification_level = 'none';

-- Вставляем тестовые данные
INSERT INTO verification_requests (user_id, status, phone, email, document_type, document_number, submitted_at)
VALUES 
    (2, 'pending', '+7 (999) 123-45-67', 'ivan@example.com', 'passport', '1234 567890', NOW() - INTERVAL '2 days'),
    (3, 'approved', '+7 (999) 234-56-78', 'maria@example.com', 'passport', '2345 678901', NOW() - INTERVAL '5 days');

UPDATE users SET email = 'test@example.com', phone = '+7 (999) 000-00-00' WHERE id = 1;