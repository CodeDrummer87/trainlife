document.addEventListener('DOMContentLoaded', async function () {

    const stage = document.getElementById('stage');
    const forms = Array.from(stage.querySelectorAll('.form-card'));
    const progress = document.getElementById('progress');
    const saveBtn = document.getElementById('saveBtn');

    let current = 0;

    // строим индикатор прогресса
    forms.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        progress.appendChild(dot);
    });
    const dots = Array.from(progress.children);

    function updateDots() {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === current);
            dot.classList.toggle('done', i < current);
        });
    }

    function goTo(index) {
        if (index < 0 || index >= forms.length) return;

        const outgoing = forms[current];
        const incoming = forms[index];

        // уходящая форма сдвигается влево и исчезает
        outgoing.classList.remove('active');
        outgoing.classList.add('leave-left');

        // входящая появляется из левого сдвига
        // (сброс положения без анимации, затем активация)
        incoming.style.transition = 'none';
        incoming.classList.remove('active', 'leave-left');
        incoming.style.transform = 'translateX(-60px)';
        incoming.style.opacity = '0';

        // принудительный reflow, чтобы браузер применил сброс
        void incoming.offsetWidth;

        incoming.style.transition = '';
        incoming.style.transform = '';
        incoming.style.opacity = '';
        incoming.classList.add('active');

        current = index;
        updateDots();
        checkComplete();
    }

    // проверка заполненности всех форм — только она определяет активность кнопки
    function checkComplete() {
        let allFilled = true;
        forms.forEach(form => {
            const fields = form.querySelectorAll('input, select');
            fields.forEach(f => {
                const empty = !String(f.value || '').trim();
                if (empty) allFilled = false;
            });
        });
        saveBtn.disabled = !allFilled;
    }

    // кнопки "Далее" и "Назад"
    stage.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        if (btn.classList.contains('btn-next')) {
            e.preventDefault();
            goTo(current + 1);
        } else if (btn.classList.contains('btn-back')) {
            e.preventDefault();
            goTo(current - 1);
        }
    });

    // слушаем изменения во всех полях, чтобы пересчитывать валидность
    stage.addEventListener('input', checkComplete);
    stage.addEventListener('change', checkComplete);

    // отправка формы
    const lastForm = forms[forms.length - 1];
    lastForm.addEventListener('submit', (e) => {
        if (saveBtn.disabled) {
            e.preventDefault();
            return;
        }
        // Здесь можно собрать данные и отправить на сервер.
        e.preventDefault();
        const data = new FormData();
        forms.forEach(form => {
            new FormData(form).forEach((v, k) => data.append(k, v));
        });
        console.log('Данные для сохранения:', Object.fromEntries(data.entries()));
        // alert('Данные готовы к сохранению (см. консоль).');
        const payload = Object.fromEntries(data.entries());
        submitIntroduce(payload);
    });

    async function loadRailways() {
        const select = document.getElementById('railway');
        const errorEl = document.getElementById('railwayError');

        try {
            const res = await fetch("/api/v1/railways", {
                headers: { 'Accept': 'application/json' }
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const railways = await res.json();

            // очищаем placeholder
            select.innerHTML = '';

            // placeholder-опция
            const placeholder = document.createElement('option');
            placeholder.value = '';
            placeholder.disabled = true;
            placeholder.selected = true;
            placeholder.textContent = '— выберите —';
            select.appendChild(placeholder);

            // сортируем по полному названию (по желанию)
            railways
                .slice()
                .sort((a, b) => a.fullTitle.localeCompare(b.fullTitle, 'ru'))
                .forEach(r => {
                    const opt = document.createElement('option');
                    opt.value = r.id;                                   // что уйдёт на сервер
                    opt.textContent = `${r.fullTitle} (${r.abbreviation})`; // что видит пользователь
                    select.appendChild(opt);
                });
        } catch (err) {
            console.error('Не удалось загрузить список железных дорог:', err);
            select.innerHTML = '<option value="" disabled selected>Ошибка загрузки</option>';
            select.disabled = true;
            errorEl.textContent = 'Не удалось загрузить список железных дорог. Обновите страницу.';
            errorEl.style.display = 'block';
        }
    }

    loadRailways();

    checkComplete();


    async function submitIntroduce(formData) {
        const res = await fetch('/api/v1/users/introduce', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',          // JWT-cookie
            body: JSON.stringify(formData)
        });
        if (res.ok) {
            setTimeout(() => {
                window.location.href = '/account';
            }, 2500);
            return true;
        }
        const err = await res.json().catch(() => ({}));
        document.getElementById('error').textContent = err.error || 'Ошибка';
        return false;
    }
});