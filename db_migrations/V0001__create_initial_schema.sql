-- Create users table for sellers
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0.0,
    verified BOOLEAN DEFAULT FALSE,
    joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table for listings
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    image_emoji VARCHAR(10) DEFAULT '📦',
    seller_id INTEGER REFERENCES users(id),
    views INTEGER DEFAULT 0,
    verified_seller BOOLEAN DEFAULT FALSE,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users
INSERT INTO users (name, rating, verified) VALUES
('Анна К.', 4.9, TRUE),
('Михаил П.', 4.7, TRUE),
('Сергей Д.', 4.8, TRUE),
('Елена Р.', 5.0, TRUE),
('Дмитрий В.', 5.0, TRUE),
('Мария С.', 5.0, TRUE),
('Алексей К.', 4.0, TRUE);

-- Insert sample products
INSERT INTO products (title, price, category, description, location, image_emoji, seller_id, views, verified_seller) VALUES
('iPhone 13 Pro 256GB', 65000, 'Электроника', 'Отличное состояние, использовался бережно. Полный комплект: коробка, зарядка, кабель. Батарея держит отлично - 89% емкости. Никаких царапин и сколов.', 'Москва, м. Кропоткинская', '📱', 1, 245, TRUE),
('Диван угловой, почти новый', 28000, 'Мебель', 'Продаю из-за переезда. Куплен год назад, в идеальном состоянии. Серый цвет, механизм раскладки работает идеально. Есть ящик для белья.', 'Санкт-Петербург, Приморский р-н', '🛋️', 2, 189, TRUE),
('Велосипед горный 29"', 18500, 'Спорт', 'Алюминиевая рама, гидравлические тормоза, 21 скорость. Проехал около 500 км. Обслуживание проведено полностью, все работает отлично.', 'Казань, Вахитовский р-н', '🚴', 3, 312, TRUE),
('Куртка зимняя North Face', 7200, 'Одежда', 'Оригинал, куплена в официальном магазине. Размер M, черная. Носила один сезон. Состояние как новая, без дефектов.', 'Екатеринбург, Центр', '🧥', 4, 156, TRUE);

-- Insert sample reviews
INSERT INTO reviews (user_id, rating, text) VALUES
(5, 5, 'Отличная платформа! Продал старый ноутбук за 2 дня. Проверка продавцов внушает доверие.'),
(6, 5, 'Купила детскую коляску в отличном состоянии. Продавец оказался надежным, все прошло гладко!'),
(7, 4, 'Хорошая площадка для покупки б/у товаров. Система рейтингов помогает выбрать проверенного продавца.');

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_posted ON products(posted_at DESC);
