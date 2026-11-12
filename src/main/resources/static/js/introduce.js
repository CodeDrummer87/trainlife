const currentMessage = document.getElementById('currentMessage');

document.addEventListener("DOMContentLoaded", async function() {

    const progress = document.getElementById('progress');
    const stage = document.getElementById('stage');
    const forms = Array.from(stage.querySelectorAll('.form-card'));
    const saveBtn = document.getElementById('saveBtn');

    const railway = document.getElementById('railway');
    const position = document.getElementById('position');
    const tabnum = document.getElementById('tabnum');
    const tabnum_long = document.getElementById('tabnum_long');
    const traffic = document.getElementById('traffic');
    const traction = document.getElementById('traction');
    const column = document.getElementById('column');
    const fullname = document.getElementById('fullname');
    const birthday = document.getElementById('birthday');
    const nickname = document.getElementById('nickname');

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

//region .:: Events chain
    await loadRailways(railway);
    railway.onchange = async function(e) {
        const railwayId = e.target.value;
        if (!railwayId) return;
        await loadLocomotiveDepots(railwayId);
    }
    await loadPositions(position);
    position.onchange = function() {
        tabnum.focus();
    }
    tabnum.onkeydown = function(e) {
        if(!/^\d$/.test(e.key) || tabnum.value.length > 4) {
            e.preventDefault();
            if (e.key === 'Enter' || e.key === 'Tab') {
                tabnum_long.focus();
            }
        }
    }
    tabnum_long.onkeydown = function (e) {
        if(!/^\d$/.test(e.key) || tabnum_long.value.length > 7) {
            e.preventDefault();
            if (e.key === 'Enter' || e.key === 'Tab') {
                goTo(current + 1);
            }
        }
    }
    await loadServiceTypes(traffic);
    await loadTractionKinds(traction);
    traction.onchange = function() {
        column.focus();
    }
    column.onkeydown = (e) => {
        if(!/^\d$/.test(e.key) || column.value.length > 1) {
            e.preventDefault();
            if (e.key === 'Enter' || e.key === 'Tab') {
                goTo(current + 1);
                fullname.focus();
            }
        }
    }
    fullname.onkeydown = function(e) {
        if (e.key === ' ' && fullname.value.slice(-1) === ' ') {
            e.preventDefault();
        }
        if(!(/^(?:[А-Яа-яЁё\s'-]|Backspace|ArrowRight|ArrowLeft|Tab|Enter)$/).test(e.key)) {
            e.preventDefault();
            if (e.key === 'Enter' || e.key === 'Tab')
                birthday.focus();
        }
    }
    nickname.onkeydown = function(e) {
        if (!(/^[A-Za-zА-Яа-яЁё]{1,10}$/).test(e.key)) {
            e.preventDefault();
        }
    }
    saveBtn.onclick = function(e) {
        e.preventDefault();

        const payload = {
            depotId: document.getElementById('depot').value,
            positionId: position.value,
            personnelNumber: tabnum.value,
            longPersonnelNumber: tabnum_long.value,
            numberOfColumn: column.value,
            serviceTypeId: traffic.value,
            tractionKind: traction.value,
            fullName: fullname.value.trim(),
            dateOfBirth: birthday.value,
            nickname: nickname.value.trim()
        }

        submitIntroduce(payload);
    }
//endregion


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

async function loadRailways(select) {

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
        const placeholder = createDefaultOption('— выберите железную дорогу—');
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
        const placeholder = createDefaultOption('— выберите локомотивное депо —');
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

async function loadPositions(select) {

    try {
        const result = await fetch(URI + "/positions", {
            headers: { 'Accept': 'application/json' },
            credentials: 'include'
        });

        if (!result.ok) {
            displayMessage(introduceCurrentMessage, 'Ошибка загрузки данных', false);
            throw new Error(`HTTP ${result.status}`);
        }

        const positions = await result.json();

        select.replaceChildren();
        const placeholder = createDefaultOption('— выберите должность —');
        select.appendChild(placeholder);

        positions
            .slice()
            .forEach(r => {
                const opt = createOption(r.id, r.title);
                select.appendChild(opt);
            });
    } catch (err) {
        displayMessage(introduceCurrentMessage, 'Не удалось загрузить список должностей', false);
        select.innerHTML = '<option value="" disabled selected>Ошибка загрузки</option>';
        select.disabled = true;
    }
}

async function loadServiceTypes(select) {

    try {
        const result = await fetch(URI + "/service-types", {
            headers: { 'Accept': 'application/json' },
            credentials: 'include'
        });

        if (!result.ok) {
            displayMessage(introduceCurrentMessage, 'Ошибка загрузки данных', false);
            throw new Error(`HTTP ${result.status}`);
        }

        const serviceTypes = await result.json();

        select.replaceChildren();
        const placeholder = createDefaultOption('— выберите вид движения —');
        select.appendChild(placeholder);

        serviceTypes
            .slice()
            .forEach(r => {
                const opt = createOption(r.id, r.title);
                select.appendChild(opt);
            });
    } catch (err) {
        displayMessage(introduceCurrentMessage, 'Не удалось загрузить виды движения', false);
        select.innerHTML = '<option value="" disabled selected>Ошибка загрузки</option>';
        select.disabled = true;
    }
}

async function loadTractionKinds(select) {

    try {
        const result = await fetch(URI + "/traction-kinds", {
            headers: { 'Accept': 'application/json' },
            credentials: 'include'
        });

        if (!result.ok) {
            displayMessage(introduceCurrentMessage, 'Ошибка загрузки данных', false);
            throw new Error(`HTTP ${result.status}`);
        }

        const tractionKinds = await result.json();

        select.replaceChildren();
        const placeholder = createDefaultOption('— выберите вид тяги —');
        select.appendChild(placeholder);

        tractionKinds
            .slice()
            .forEach(r => {
                const opt = createOption(r.id, r.title);
                select.appendChild(opt);
            });
    } catch (err) {
        displayMessage(introduceCurrentMessage, 'Не удалось загрузить виды тяги', false);
        select.innerHTML = '<option value="" disabled selected>Ошибка загрузки</option>';
        select.disabled = true;
    }
}

async function submitIntroduce(introduceData) {
    const res = await fetch(URI + '/users/introduce', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(introduceData)
    });
    if (res.ok) {
        const data = await res.json();
        displayMessage(currentMessage, data.message, true);
        console.log("Успех");
        console.log(currentMessage);
        setTimeout(() => {
            window.location.href = '/account';
        }, 3000);
        return true;
    }
    const err = await res.json().catch(() => ({}));
    console.log(err.error);
    return false;
}
