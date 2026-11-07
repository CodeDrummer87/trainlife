const introduceCurrentMessage = document.getElementById('introduceCurrentMessage');

document.addEventListener("DOMContentLoaded", function() {

    const progress = document.getElementById('progress');
    const stage = document.getElementById('stage');
    const forms = Array.from(stage.querySelectorAll('.form-card'));
    const saveBtn = document.getElementById('saveBtn');

    const railway = document.getElementById('railway');

//region .:: Progress bar
    for (let i = 0; i < forms.length; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        progress.appendChild(dot);
    }

    let current = 0;

    const dots = Array.from(progress.children);
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.toggle('active', i === current);
        dots[i].classList.toggle('done', i < current);
    }

    function updateDots() {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === current);
            dot.classList.toggle('done', i < current);
        });
    }
//endregion

    loadRailways();
    railway.onchange = async function(e) {
        const railwayId = e.target.value;
        if (!railwayId) return;
        await loadLocomotiveDepots(railwayId);
    }

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

    function goTo(index) {
        if (index < 0 || index >= forms.length) return;

        const outgoing = forms[current];
        const incoming = forms[index];

        outgoing.classList.remove('active');
        outgoing.classList.add('leave-left');

        incoming.style.transition = 'none';
        incoming.classList.remove('active', 'leave-left');
        incoming.style.transform = 'translateX(-60px)';
        incoming.style.opacity = '0';

        void incoming.offsetWidth;

        incoming.style.transition = '';
        incoming.style.transform = '';
        incoming.style.opacity = '';
        incoming.classList.add('active');

        current = index;
        updateDots();
        checkComplete();
    }

    stage.onclick = (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        if (btn.classList.contains('btn-next')) {
            e.preventDefault();
            goTo(current + 1);
        } else if (btn.classList.contains('btn-back')) {
            e.preventDefault();
            goTo(current - 1);
        }
    };

    stage.addEventListener('input', checkComplete);
    stage.addEventListener('change', checkComplete);
});

async function loadRailways() {
    const select = document.getElementById('railway');

    try {
        const result = await fetch(URI + "/railways", {
            headers: { 'Accept': 'application/json' },
            credentials: 'include'
        });

        if (!result.ok) {
            displayMessage(introduceCurrentMessage, 'Ошибка загрузки данных', false);
            throw new Error(`HTTP ${result.status}`);
        }

        const railways = await result.json();

        select.replaceChildren();
        const placeholder = createDefaultOption('— выберите —');
        select.appendChild(placeholder);

        railways
            .slice()
            .forEach(r => {
                const opt = createOption(r.id, `${r.fullTitle} (${r.abbreviation})`);
                select.appendChild(opt);
            });
    } catch (err) {
        displayMessage(introduceCurrentMessage, 'Не удалось загрузить список железных дорог', false);
        select.innerHTML = '<option value="" disabled selected>Ошибка загрузки</option>';
        select.disabled = true;
    }
}

async function loadLocomotiveDepots(railwayId) {
    const select = document.getElementById('depot');

    try {
        const result = await fetch(URI + `/locomotive-depots/by-railway/${railwayId}`, {
            headers: { 'Accept': 'application/json' },
            credentials: 'include'
        });

        if (!result.ok) {
            displayMessage(introduceCurrentMessage, 'Ошибка загрузки данных', false);
            throw new Error(`HTTP ${result.status}`);
        }

        const depots = await result.json();

        select.replaceChildren();
        const placeholder = createDefaultOption('— выберите —');
        select.appendChild(placeholder);

        if (depots.length === 0) {
            select.appendChild(createDefaultOption('список пуст'))
            return;
        }
        depots
            .slice()
            .forEach(d => {
                const opt = createOption(d.id, d.shortTitle);
                select.appendChild(opt);
            });
    } catch (err) {
        displayMessage(introduceCurrentMessage, 'Не удалось загрузить список депо для данной дороги', false);
        select.innerHTML = '<option value="" disabled selected>Ошибка загрузки</option>';
        select.disabled = true;
    }
}
