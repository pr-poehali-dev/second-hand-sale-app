CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO notifications (user_id, type, title, message, is_read, created_at) VALUES
(2, 'verification_approved', 'Верификация одобрена', 'Ваша заявка на верификацию одобрена! Теперь у вас есть бейдж "Проверенный продавец".', FALSE, CURRENT_TIMESTAMP - INTERVAL '1 hour'),
(3, 'verification_rejected', 'Заявка отклонена', 'К сожалению, ваша заявка отклонена. Причина: Недостаточно данных для проверки.', FALSE, CURRENT_TIMESTAMP - INTERVAL '2 hours');