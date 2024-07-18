CREATE TABLE IF NOT EXISTS basic_logs (
    id SERIAL PRIMARY KEY,
    -- timestamp TIMESTAMP NOT NULL,
    event VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS level_logs (
    id SERIAL PRIMARY KEY,
    -- timestamp TIMESTAMP NOT NULL,
    level VARCHAR(50),
    event VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS detailed_logs (
    id SERIAL PRIMARY KEY,
    -- timestamp TIMESTAMP NOT NULL,
    level VARCHAR(50),
    message TEXT,
    user_id TEXT,
    user_name VARCHAR(255),
    user_email VARCHAR(255),
    user_ip VARCHAR(50)
    -- user_location_latitude FLOAT
    -- user_location_longitude FLOAT,
    -- request_method VARCHAR(10),
    -- request_url TEXT,
    -- request_status INT,
    -- request_response_time INT,
    -- request_user_agent TEXT,
    -- system_cpu_usage FLOAT,
    -- system_memory_usage INT,
    -- system_disk_usage INT
);
