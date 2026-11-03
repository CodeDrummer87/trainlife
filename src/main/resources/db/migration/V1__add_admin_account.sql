CREATE TABLE IF NOT EXISTS public.accounts (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL
);

INSERT INTO accounts (username, password, role)
VALUES (
    'admin',
    '$2a$10$QZKDu5wFDsThS47lP37P5eV8pP60Sxw37/ewQCbab3bnfqVCYauvm',
    'ADMIN'
)
ON CONFLICT (username) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.users (
    id BIGSERIAL PRIMARY KEY,
    account_id BIGINT NOT NULL UNIQUE,

    FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE
);

INSERT INTO public.users (account_id)
SELECT id FROM public.accounts WHERE username = 'admin'
ON CONFLICT (account_id) DO NOTHING;