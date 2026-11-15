const currentMessage = document.getElementById('currentMessage');

document.addEventListener('DOMContentLoaded', async () => {
    renderProfile(await loadProfile());
    await mountUserReminder();
    initNewTrip();
});

document.getElementById('accountButton').onclick = () => {
    window.location.href = '/account';
}

function createEmptyTrip() {
    return {
        trainType: 'TRAIN',
        loco: { series: '', number: '', depot: '', shoes: '' },
        train: { number: '', weight: '', axles: '', length: '', tailCarNumber: '', securing: '' },
        dit: { number: '', locomotives: [] },   //.:: Dead In Tow
        ler: { number: '' },                    //.:: Light Engine Running
        departure: { station: '', time: '', signal: '' },
        brakeTests: [],
        passStations: [],
        stops: [],
        notes: '',
        arrival: { station: '', time: '', signal: '' },
    };
}

function initNewTrip() {
    const saveBtn = document.getElementById('saveBtn');
    const addTrainBtn = document.getElementById('addTrainBtn');

    const report = { date: '', time: '', point: '', handoverTime: '' };
    let currentTrip = createEmptyTrip();
    const trips = [];

    let currentStep = 1;

    //.:: DOM :::
    const $ = (id) => document.getElementById(id);
    const reportDate    = $('reportDate');
    const reportTime    = $('reportTime');
    const reportPoint   = $('reportPoint');
    const trainTypeSel  = $('trainType');
    const locoSeries    = $('locoSeries');
    const locoNumber    = $('locoNumber');
    const locoDepot     = $('locoDepot');
    const locoShoes     = $('locoShoes');
    const depStation    = $('depStation');
    const depTime       = $('depTime');
    const depSignal     = $('depSignal');
    const arrStation    = $('arrStation');
    const arrTime       = $('arrTime');
    const arrSignal     = $('arrSignal');
    const handoverTime  = $('handoverTime');
    const form4Title    = $('form4Title');
    const form4Hint     = $('form4Hint');
    const form6Hint     = $('form6Hint');
    const ditList       = $('ditList');
    const brakeTestList = $('brakeTestList');
    const passList      = $('passList');
    const stopList      = $('stopList');
    const addPassBtn    = $('addPassBtn');
    const addStopBtn    = $('addStopBtn');
    const addLocoBtn    = $('addLocoBtn');
    const addBrakeBtn   = $('addBrakeBtn');
    const notes         = $('notes');

    function goTo(index) {
        if (index < 0 || index >= forms.length) return;
        syncCurrentForm();

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
        currentStep = Number(incoming.dataset.step);
        updateDots();
        checkComplete();
    }

    stage.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        if (btn.classList.contains('btn-next')) {
            e.preventDefault();
            if (validateStep(currentStep)) goTo(current + 1);
            else displayMessage(currentMessage, 'Заполните обязательные поля', false);
        } else if (btn.classList.contains('btn-back')) {
            e.preventDefault();
            goTo(current - 1);
        }
    });

    function validateStep(step) {
        const form = forms.find(f => Number(f.dataset.step) === step);
        if (!form) return true;

        if (step === 2) {
            return !!trainTypeSel.value;
        }

        if (step === 4 && currentTrip.trainType === 'DIT') {
            const rows = Array.from(ditList.querySelectorAll('.dit-row'));
            if (rows.length === 0) return false;
            return rows.every(r => r.querySelector('select').value && r.querySelector('input').value.trim());
        }

        if (step === 6 && currentTrip.trainType !== 'LER') {
            const rows = Array.from(brakeTestList.querySelectorAll('.brake-row'));
            if (rows.length === 0) return false;
            return rows.every(r => r.querySelector('select').value);
        }

        const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
        for (const f of fields) {
            if (f.closest('.variant[hidden]')) continue;
            if (!String(f.value || '').trim()) return false;
        }
        return true;
    }

    function syncCurrentForm() {
        if (currentStep === 1) {
            report.date  = reportDate.value;
            report.time  = reportTime.value;
            report.point = reportPoint.value;
        } else if (currentStep === 2) {
            currentTrip.trainType = trainTypeSel.value || 'TRAIN';
            applyVariant();
        } else if (currentStep === 3) {
            currentTrip.loco = {
                series: locoSeries.value,
                number: locoNumber.value.trim(),
                depot:  locoDepot.value.trim(),
                shoes:  locoShoes.value.trim(),
            };
        } else if (currentStep === 4) {
            syncForm4();
        } else if (currentStep === 5) {
            currentTrip.departure = {
                station: depStation.value,
                time: depTime.value,
                signal: depSignal.value,
            };
        } else if (currentStep === 6) {
            if (currentTrip.trainType === 'LER') {
                currentTrip.brakeTests = ['FIRST_REMOVAL'];
            } else {
                currentTrip.brakeTests = Array.from(brakeTestList.querySelectorAll('.brake-row'))
                    .map(r => r.querySelector('select').value);
            }
        } else if (currentStep === 7) {
            currentTrip.passStations = Array.from(passList.querySelectorAll('.dynamic-row')).map(row => ({
                station: row.querySelector('select').value,
                time: row.querySelector('input').value,
            }));
        } else if (currentStep === 8) {
            currentTrip.stops = Array.from(stopList.querySelectorAll('.dynamic-row')).map(row => ({
                place: row.querySelector('input').value.trim(),
            }));
        } else if (currentStep === 9) {
            currentTrip.notes = notes.value;
        } else if (currentStep === 10) {
            currentTrip.arrival = {
                station: arrStation.value,
                time: arrTime.value,
                signal: arrSignal.value,
            };
            report.handoverTime = handoverTime.value;
        }
    }

    function syncForm4() {
        const type = currentTrip.trainType;
        if (type === 'TRAIN') {
            currentTrip.train = {
                number: $('trainNumber').value.trim(),
                weight: $('trainWeight').value.trim(),
                axles:  $('trainAxles').value.trim(),
                length:     $('trainLength').value.trim(),
                tailCarNumber:     $('trainTailCarNumber').value.trim(),
                securing:    $('trainSecuring').value.trim(),
            };
        } else if (type === 'DIT') {
            currentTrip.dit = {
                number: $('ditNumber').value.trim(),
                locomotives: Array.from(ditList.querySelectorAll('.dit-row')).map(row => ({
                    series: row.querySelector('select').value,
                    number: row.querySelector('input').value.trim(),
                })),
            };
        } else if (type === 'LER') {
            currentTrip.ler = { number: $('lerNumber').value.trim() };
        }
    }

    function applyVariant() {
        const type = currentTrip.trainType;

        stage.querySelectorAll('.form-card[data-step="4"] .variant').forEach(v => {
            v.hidden = !v.dataset.variant.split(/\s+/).includes(type);
        });
        form4Title.textContent =
            type === 'TRAIN'   ? 'Данные поезда' :
                type === 'DIT' ? 'Сплотка'      :
                    'Следование резервом';
        form4Hint.textContent =
            type === 'TRAIN'   ? 'Номер поезда и параметры состава' :
                type === 'DIT' ? 'Номер и локомотивы' :
                    'Номер поезда';

        stage.querySelectorAll('.form-card[data-step="6"] .variant').forEach(v => {
            v.hidden = !v.dataset.variant.split(/\s+/).includes(type);
        });
        form6Hint.textContent =
            type === 'LER' ? 'Проба на первом удалении' : 'Места опробывания тормозов';
    }

    trainTypeSel.addEventListener('change', () => {
        currentTrip.trainType = trainTypeSel.value || 'TRAIN';
        applyVariant();
        if (currentTrip.trainType === 'LER') {
            brakeTestList.replaceChildren();
        }
        if (currentTrip.trainType !== 'LER' && brakeTestList.children.length === 0) {
            brakeTestList.appendChild(makeBrakeRow());
        }
        checkComplete();
    });

    function makeLocoRow(series = '', number = '') {
        const row = document.createElement('div');
        row.className = 'dynamic-row dit-row';

        const sel = document.createElement('select');
        sel.required = true;
        sel.innerHTML = `
            <option value="" disabled ${series ? '' : 'selected'}>— серия —</option>
            <option value="ВЛ10"  ${series === 'ВЛ10'  ? 'selected' : ''}>ВЛ10</option>
            <option value="2ЭС6"  ${series === '2ЭС6'  ? 'selected' : ''}>2ЭС6</option>
            <option value="ВЛ80с" ${series === 'ВЛ80с' ? 'selected' : ''}>ВЛ80с</option>
        `;

        const inp = document.createElement('input');
        inp.type = 'text';
        inp.placeholder = 'Номер';
        inp.required = true;
        inp.value = number;

        const rm = document.createElement('button');
        rm.type = 'button';
        rm.className = 'btn-remove';
        rm.textContent = 'X';
        rm.title = 'Удалить';
        rm.onclick = () => { row.remove(); checkComplete(); };

        row.append(sel, inp, rm);
        return row;
    }
    addLocoBtn.addEventListener('click', () => ditList.appendChild(makeLocoRow()));

    function makeBrakeRow(peregon = '') {
        const row = document.createElement('div');
        row.className = 'dynamic-row brake-row';

        const sel = document.createElement('select');
        sel.required = true;
        sel.innerHTML = `
            <option value="" disabled ${peregon ? '' : 'selected'}>— перегон —</option>
            <option value="1" ${peregon === '1' ? 'selected' : ''}>Перегон 1</option>
            <option value="2" ${peregon === '2' ? 'selected' : ''}>Перегон 2</option>
            <option value="3" ${peregon === '3' ? 'selected' : ''}>Перегон 3</option>
        `;

        const rm = document.createElement('button');
        rm.type = 'button';
        rm.className = 'btn-remove';
        rm.textContent = 'X';
        rm.title = 'Удалить';
        rm.onclick = () => { row.remove(); checkComplete(); };

        row.append(sel, rm);
        return row;
    }
    addBrakeBtn.addEventListener('click', () => brakeTestList.appendChild(makeBrakeRow()));


    function makePassRow(station = '', time = '') {
        const row = document.createElement('div');
        row.className = 'dynamic-row';

        const sel = document.createElement('select');
        sel.required = true;
        sel.innerHTML = `
            <option value="" disabled ${station ? '' : 'selected'}>— станция —</option>
            <option value="1" ${station === '1' ? 'selected' : ''}>Станция 1</option>
            <option value="2" ${station === '2' ? 'selected' : ''}>Станция 2</option>
            <option value="3" ${station === '3' ? 'selected' : ''}>Станция 3</option>
            <option value="4" ${station === '4' ? 'selected' : ''}>Станция 4</option>
        `;

        const inp = document.createElement('input');
        inp.type = 'time';
        inp.required = true;
        inp.value = time;

        const rm = document.createElement('button');
        rm.type = 'button';
        rm.className = 'btn-remove';
        rm.textContent = 'X';
        rm.title = 'Удалить';
        rm.onclick = () => { row.remove(); checkComplete(); };

        row.append(sel, inp, rm);
        return row;
    }
    addPassBtn.addEventListener('click', () => passList.appendChild(makePassRow()));

    function makeStopRow(place = '') {
        const row = document.createElement('div');
        row.className = 'dynamic-row';

        const inp = document.createElement('input');
        inp.type = 'text';
        inp.placeholder = 'Место остановки';
        inp.required = true;
        inp.value = place;

        const rm = document.createElement('button');
        rm.type = 'button';
        rm.className = 'btn-remove';
        rm.textContent = 'X';
        rm.title = 'Удалить';
        rm.onclick = () => { row.remove(); checkComplete(); };

        row.append(inp, rm);
        return row;
    }
    addStopBtn.addEventListener('click', () => stopList.appendChild(makeStopRow()));


    function isTripComplete() {
        if (!report.date || !report.time || !report.point) return false;
        if (!currentTrip.trainType) return false;

        const l = currentTrip.loco || {};
        if (!l.series || !l.number || !l.depot || !l.shoes) return false;

        const t = currentTrip.trainType;
        if (t === 'TRAIN') {
            const tr = currentTrip.train || {};
            if (!tr.number || !tr.weight || !tr.axles || !tr.length || !tr.tailCarNumber || !tr.securing) return false;
        } else if (t === 'DIT') {
            const sp = currentTrip.dit || {};
            if (!sp.number) return false;
            const locos = sp.locomotives || [];
            if (locos.length === 0 || locos.some(x => !x.series || !x.number)) return false;
        } else if (t === 'LER') {
            if (!(currentTrip.ler && currentTrip.ler.number)) return false;
        }

        const d = currentTrip.departure || {};
        if (!d.station || !d.time || !d.signal) return false;

        if (t !== 'LER') {
            const brakes = currentTrip.brakeTests || [];
            if (brakes.length === 0 || brakes.some(b => !b)) return false;
        }

        const a = currentTrip.arrival || {};
        if (!a.station || !a.time || !a.signal) return false;

        return true;
    }

    function isTripCompleteForSave() {
        if (!isTripComplete()) return false;
        if (!report.handoverTime) return false;
        return true;
    }

    function checkComplete() {
        syncCurrentForm();
        saveBtn.disabled = !isTripCompleteForSave();
        addTrainBtn.disabled = !!report.handoverTime;
    }

    stage.addEventListener('input', checkComplete);
    stage.addEventListener('change', checkComplete);


    addTrainBtn.addEventListener('click', () => {
        if (report.handoverTime) return;
        syncCurrentForm();

        if (!isTripComplete()) {
            displayMessage(currentMessage, 'Заполните обязательные поля текущего поезда', false);
            return;
        }

        trips.push(currentTrip);
        currentTrip = createEmptyTrip();
        resetForms2to10();
        goTo(1);
        displayMessage(currentMessage, `Поезд добавлен в очередь (${trips.length})`, true);
    });

    saveBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        syncCurrentForm();
        if (!isTripCompleteForSave()) return;

        const payload = {
            report: { ...report },
            trips: [...trips, currentTrip],
        };

        // TODO: заменить на реальный эндпоинт
        console.log('PAYLOAD:', JSON.stringify(payload, null, 2));
        displayMessage(currentMessage, 'Сохранено (демо)', true);
    });

    function resetForms2to10() {

        trainTypeSel.value = 'TRAIN';
        currentTrip.trainType = 'TRAIN';
        applyVariant();

        locoSeries.value = '';
        locoNumber.value = '';
        locoDepot.value = '';
        locoShoes.value = '';

        ['trainNumber', 'trainWeight', 'trainAxles', 'trainLength', 'trainTailCarNumber', 'trainSecuring',
            'ditNumber', 'lerNumber'].forEach(id => {
            const el = $(id);
            if (el) el.value = '';
        });
        ditList.replaceChildren();

        depStation.value = '';
        depTime.value = '';
        depSignal.value = '';

        brakeTestList.replaceChildren();
        brakeTestList.appendChild(makeBrakeRow());
        currentTrip.brakeTests = [];

        passList.replaceChildren();
        stopList.replaceChildren();
        currentTrip.passStations = [];
        currentTrip.stops = [];

        notes.value = '';
        currentTrip.notes = '';

        arrStation.value = '';
        arrTime.value = '';
        arrSignal.value = '';
        currentTrip.arrival = { station: '', time: '', signal: '' };

        checkComplete();
    }


    applyVariant();
    brakeTestList.appendChild(makeBrakeRow());
    checkComplete();
}
