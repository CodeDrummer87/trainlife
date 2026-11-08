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