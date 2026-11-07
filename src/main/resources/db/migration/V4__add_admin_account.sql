CREATE TABLE IF NOT EXISTS accounts (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    was_introduced BOOLEAN DEFAULT false
);

INSERT INTO accounts (username, password, role)
VALUES (
    'admin',
    '$2a$10$QZKDu5wFDsThS47lP37P5eV8pP60Sxw37/ewQCbab3bnfqVCYauvm',
    'ADMIN'
)
ON CONFLICT (username) DO NOTHING;

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    account_id BIGINT NOT NULL UNIQUE,
    nickname VARCHAR(20) UNIQUE,
    full_name VARCHAR(100),
    date_of_birth DATE,
    position_id BIGINT,
    number_of_column INT,
    personnel_number INT,
    long_personnel_number INT,
    tractionKind VARCHAR(12),
    service_type VARCHAR(15),
    locomotive_depot_id BIGINT,

    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (position_id) REFERENCES positions(id) ON DELETE SET NULL,
    FOREIGN KEY (locomotive_depot_id) REFERENCES locomotive_depots(id) ON DELETE SET NULL
);

INSERT INTO users (account_id)
SELECT id FROM accounts WHERE username = 'admin'
ON CONFLICT (account_id) DO NOTHING;