CREATE TABLE IF NOT EXISTS basic_logs (
    id SERIAL PRIMARY KEY,
    event VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS level_logs (
    id SERIAL PRIMARY KEY,
    level VARCHAR(50),
    event VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS detailed_logs (
    id SERIAL PRIMARY KEY,
    level VARCHAR(50),
    message TEXT,
    user_id VARCHAR(255) 
);


