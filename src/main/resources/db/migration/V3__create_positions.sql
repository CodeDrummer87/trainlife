CREATE TABLE IF NOT EXISTS public.positions (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(26) NOT NULL,
    abbreviate VARCHAR(11) NOT NULL
);

INSERT INTO public.positions (title,  abbreviate)
VALUES
    ('Машинист', 'ТЧМ'),
    ('Помощник машиниста', 'ТЧПМ'),
    ('Машинист-инструктор', 'ТЧМИ'),
    ('Дублёр помощника машиниста', 'Дублёр ТЧПМ'),
    ('Дублёр машиниста', 'Дублёр ТЧМ');