document.addEventListener('DOMContentLoaded', async () => {
    const currentMessage= document.getElementById('currentMessage');

    const reportDate    = document.getElementById('reportDate');
    setCurrentDate(reportDate);

    const reportTime    = document.getElementById('reportTime');
    const reportPoint   = document.getElementById('reportPoint');
    await getStationsWithTurnoutPoint();
    const trainTypeSel  = document.getElementById('trainType');

    const locoType      = document.getElementById('locoType');
    const locoTypeArr  = sessionStorage.getItem('locomotive-types') ?
        JSON.parse(sessionStorage.getItem('locomotive-types')) : await getAllLocomotiveTypes();
    await renderLocomotiveTypes(locoTypeArr);

    const locoSeries    = document.getElementById('locoSeries');
    const locoSeriesArr= sessionStorage.getItem('locomotive-series') ?
        JSON.parse(sessionStorage.getItem('locomotive-series')) : await getAllLocomotiveSeries();
    await renderLocomotiveSeries(locoSeriesArr, 1);

    const locoNumber    = document.getElementById('locoNumber');

    const railway       = document.getElementById('railway');
    const railwayArr   = sessionStorage.getItem('railways') ?
        JSON.parse(sessionStorage.getItem('railways')) : await loadRailways();
    await renderRailways(railwayArr, railway);
    railway.value = sessionStorage.getItem('railwayId') ? sessionStorage.getItem('railwayId') : 5;

    const locoDepot     = document.getElementById('locoDepot');
    const locoDepotsArr= sessionStorage.getItem('locomotive-depots') ?
        JSON.parse(sessionStorage.getItem('locomotive-depots')) : await getAllLocomotiveDepots();
    await renderLocomotiveDepots(locoDepotsArr, 5);

    const locoShoes     = document.getElementById('locoShoes');
    const trainNumber   = document.getElementById('trainNumber');
    const trainWeight   = document.getElementById('trainWeight');
    const trainAxles    = document.getElementById('trainAxles');
    const trainLength   = document.getElementById('trainLength');
    const trainTailCarNumber= document.getElementById('trainTailCarNumber');
    const cargo         = document.getElementById('cargo');
    const carBraking    = document.getElementById('carBraking');
    const trainSecuring = document.getElementById('trainSecuring');

    const depRailway    = document.getElementById('depRailway');
    await renderRailways(railwayArr, depRailway);
    depRailway.value = sessionStorage.getItem('railwayId') ? sessionStorage.getItem('railwayId') : 5;
    const depStation    = document.getElementById('depStation');
    await renderStations(depStation, await getStationsByRailway(depRailway.value));

    const depTime       = document.getElementById('depTime');
    const depSignal     = document.getElementById('depSignal');
    const arrStation    = document.getElementById('arrStation');
    const arrTime       = document.getElementById('arrTime');
    const arrSignal     = document.getElementById('arrSignal');
    const handoverTime  = document.getElementById('handoverTime');
    const form4Title    = document.getElementById('form4Title');
    const form4Hint     = document.getElementById('form4Hint');
    const form6Hint     = document.getElementById('form6Hint');
    const ditList       = document.getElementById('ditList');
    const brakeTestList = document.getElementById('brakeTestList');
    const passList      = document.getElementById('passList');
    const stopList      = document.getElementById('stopList');
    const addPassBtn    = document.getElementById('addPassBtn');
    const addStopBtn    = document.getElementById('addStopBtn');
    const addLocoBtn    = document.getElementById('addLocoBtn');
    const addBrakeBtn   = document.getElementById('addBrakeBtn');
    const notes         = document.getElementById('notes');

    renderProfile(await loadProfile());
    await mountUserReminder();
    await initNewTrip();

    function setCurrentDate(reportDate) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        reportDate.value = `${yyyy}-${mm}-${dd}`;
    }

    reportDate.onblur = (e) => {
        checkDataValue(e);
    };
    reportDate.onkeydown = (e) => {
        const allowed = ['Enter', 'Tab'];
        if (allowed.includes(e.key)) {
            checkDataValue(e);
        }
    }

    function checkDataValue(e) {
        let v = e.target.value;

        const parts = v.split('-');
        const year = Number(parts[0]);
        const currentYear = new Date().getFullYear();

        if (!Number.isFinite(year) || year > currentYear || year < Number(1900)) {
            displayMessage(currentMessage, 'Некорректно указан год. Установлена текущая дата', false);
            setCurrentDate(reportDate);
            return;
        }
        reportTime.focus();
    }

    locoNumber.onkeydown = function(e) {
        inputDigits(e, locoNumber, 4, function() {
            locoDepot.focus();
        });
    }

    locoShoes.oninput = (e) => {
        let v = e.target.value;

        v = v.replace(/[^\d-]/g, '');
        const userDash = v.indexOf('-');
        let first, second;
        if (userDash !== -1) {
            first = v.slice(0, userDash).replace(/-/g, '');
            second = v.slice(userDash + 1).replace(/-/g, '');
        } else {
            let digits = v.replace(/-/g, '');
            if (digits.length > 2) {
                first = digits.slice(0, 2);
                second = digits.slice(2);
            } else {
                first = digits;
                second = '';
            }
        }

        first = first.replace(/^0+/, '');
        if (first.length > 0 && Number(first) > 32) {
            first = '32';
        }
        if (second.length > 1) {
            second = second.slice(0, 1);
        }
        if (second !== '' && Number(second) > 9) {
            second = '9';
        }
        if (first !== '' && second !== '' && Number(second) >= Number(first)) {
            second = String(Math.max(0, Number(first) - 1));
        }
        if (first === '') {
            v = '';
        } else if (second === '' && userDash === -1 && first.length <= 2) {
            v = first;
        } else if (second === '') {
            v = first + '-';
        } else {
            v = first + '-' + second;
        }

        e.target.value = v;
    };

    document.getElementById('accountButton').onclick = () => {
        window.location.href = '/account';
    }

    locoType.onchange = async () => {
        const id = locoType.value;
        await renderLocomotiveSeries(locoSeriesArr, id);
    }

    railway.onchange = async () => {
        const id = railway.value;
        await renderLocomotiveDepots(locoDepotsArr, id);
    }

    trainNumber.onkeydown = (e) => {
        inputDigits(e, trainNumber, 4, function() {
            trainWeight.focus();
        });
    }

    trainWeight.onkeydown = (e) => {
        inputDigits(e, trainWeight, 4, () => {
           trainAxles.focus();
           evaluateTrainSecuring();
        });
    }

    trainAxles.onkeydown = (e) => {
        inputDigits(e, trainAxles, 3, () => {
            trainLength.focus();
        });
    }

    trainLength.onkeydown = (e) => {
        inputDigits(e, trainLength , 2, () => {
            trainTailCarNumber.focus();
        })
    }

    trainTailCarNumber.onkeydown = (e) => {
        inputDigits(e, trainTailCarNumber, 8, () => {
            trainSecuring.focus();
        })
    }

    cargo.onclick = () => {
        cargo.innerText = cargo.innerText === 'ГРУЖЁНОГО' ? 'ПОРОЖНЕГО' : 'ГРУЖЁНОГО';
        evaluateTrainSecuring();
    }
    trainWeight.onblur = () => {
        evaluateTrainSecuring();
    }

    carBraking.onclick = () => {
        carBraking.innerText = carBraking.innerText === 'НЕРАЗДЕЛЬНОЕ' ? 'РАЗДЕЛЬНОЕ' : 'НЕРАЗДЕЛЬНОЕ';
        evaluateTrainSecuring();
    }

    trainSecuring.onkeydown = (e) => {
        const allowed = ['0','1','2','3','4','5','6','7','8','9',
            'Enter', 'ArrowLeft', 'ArrowRight', 'Backspace', 'Т', 'Б', 'Р', '-', ];
        if (!allowed.includes(e.key)) {
            e.preventDefault();
        }
        function checkChar(char) {
            const l = trainSecuring.value.length;
            const unrepeatableAllowed = ['Б', 'Т', 'Р'];
            if (e.key === char && (trainSecuring.value[l - 1] === char
            || unrepeatableAllowed.includes(trainSecuring.value[l - 2]))) {
                e.preventDefault();
            }
        }
        checkChar('Б');
        checkChar('Т');
        checkChar('Р');
        if (e.key === '-' && trainSecuring.value.includes('-')) {
            e.preventDefault();
        }
    }

    depRailway.onchange = async () => {
        const data = await getStationsByRailway(depRailway.value);
        await renderStations(depStation, data);
    }


    function createEmptyTrip() {
        return {
            trainType: 'TRAIN',
            loco: { type: '', series: '', number: '', depot: '', shoes: '' },
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

    async function initNewTrip() {
        const saveBtn = document.getElementById('saveBtn');
        const addTrainBtn = document.getElementById('addTrainBtn');

        const report = { date: '', time: '', point: '', handoverTime: '' };
        let currentTrip = createEmptyTrip();
        const trips = [];

        let currentStep = 1;

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

            if (step === 3) {
                return !!locoType.value && !!locoSeries.value
                    && !!locoNumber.value.trim() && !!locoDepot.value && !!locoShoes.value.trim();
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
                    type:   locoType.value,
                    series: locoSeries.value,
                    number: locoNumber.value.trim(),
                    depot:  locoDepot.value,
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
                    number: trainNumber.value.trim(),
                    weight: trainWeight.value.trim(),
                    axles:  trainAxles.value.trim(),
                    length: trainLength.value.trim(),
                    tailCarNumber: trainTailCarNumber.value.trim(),
                    securing: trainSecuring.value.trim(),
                };
            } else if (type === 'DIT') {
                currentTrip.dit = {
                    number: document.getElementById('ditNumber').value.trim(),
                    locomotives: Array.from(ditList.querySelectorAll('.dit-row')).map(row => ({
                        series: row.querySelector('select').value,
                        number: row.querySelector('input').value.trim(),
                    })),
                };
            } else if (type === 'LER') {
                currentTrip.ler = { number: document.getElementById('lerNumber').value.trim() };
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
            if (!l.type || !l.series || !l.number || !l.depot || !l.shoes) return false;

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

            // TODO: добавить эндпойнт + очистить sessionStorage
            console.log('PAYLOAD:', JSON.stringify(payload, null, 2));
            displayMessage(currentMessage, 'Сохранено (демо)', true);
        });

        function resetForms2to10() {

            trainTypeSel.value = 'TRAIN';
            currentTrip.trainType = 'TRAIN';
            applyVariant();

            locoType.value = '';
            locoSeries.value = '';
            locoNumber.value = '';
            locoDepot.value = '';
            locoShoes.value = '';

            ['trainNumber', 'trainWeight', 'trainAxles', 'trainLength', 'trainTailCarNumber', 'trainSecuring',
                'ditNumber', 'lerNumber'].forEach(id => {
                const el = document.getElementById(id);
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

    async function getStationsWithTurnoutPoint() {
        try {
            const result = await fetch(URI + "/stations/with-turnout-point", {
                headers: {'Accept': 'application/json'},
                credentials: 'include'
            });

            if (!result.ok) {
                displayMessage(currentMessage, 'Ошибка загрузки списка станций', false);
                throw new Error(`HTTP ${result.status}`);
            }

            const stations = await result.json();
            await renderStations(reportPoint, stations);
        } catch (err) {
            displayMessage(currentMessage, 'Не удалось загрузить список пунктов явки', false);
            reportPoint.innerHTML = '<option value="" disabled selected>Ошибка загрузки</option>';
            reportPoint.disabled = true;
        }
    }

    async function renderStations(select, data) {
        select.replaceChildren();
        const placeholder = createDefaultOption(data.length === 0 ? 'список пуст' : '— выберите из списка —');
        select.appendChild(placeholder);

        if (data.length === 0) return;

        data
            .slice()
            .forEach(r => {
                const opt = createOption(r.id, `${r.stationTitle} (${r.railwayAbbreviation})`);
                select.appendChild(opt);
            });
    }

    async function getAllLocomotiveTypes() {
        try {
            const result = await fetch(URI + "/locomotive-types", {
                headers: {'Accept': 'application/json'},
                credentials: 'include'
            });

            if (!result.ok) {
                displayMessage(currentMessage, 'Ошибка загрузки типов локомотивов', false);
                throw new Error(`HTTP ${result.status}`);
            }

            const data = await result.json();
            sessionStorage.setItem('locomotive-types', JSON.stringify(data));
            return data;
        } catch (err) {
            displayMessage(currentMessage, 'Не удалось загрузить список типов локомотивов', false);
            locoType.innerHTML = '<option value="" disabled selected>Ошибка загрузки</option>';
            locoType.disabled = true;
        }
    }

    async function renderLocomotiveTypes(data) {
        locoType.replaceChildren();
        const placeholder = createDefaultOption('тип лок-ва');
        locoType.appendChild(placeholder);

        data
            .slice()
            .forEach(t => {
                const opt = createOption(t.id, `${t.title}`);
                locoType.appendChild(opt);
            });
    }

    async function getAllLocomotiveSeries() {
        try {
            const result = await fetch(URI + '/locomotive-series', {
                headers: {'Accept': 'application/json'},
                credentials: 'include'
            });

            if (!result.ok) {
                displayMessage(currentMessage, 'Ошибка загрузки серий локомотивов', false);
                throw new Error(`HTTP: ${result.status}`);
            }

            const data = await result.json();
            sessionStorage.setItem('locomotive-series', JSON.stringify(data));
            return data;
        } catch {
            displayMessage(currentMessage, 'Не удалось загрузить список серий локомотивов', false);
            locoSeries.innerHTML = '<option value="" disabled selected>Ошибка загрузки</option>';
            locoSeries.disabled = true;
        }
    }

    async function renderLocomotiveSeries(data, id) {
        locoSeries.replaceChildren();
        const placeholder = createDefaultOption('серия');
        locoSeries.appendChild(placeholder);

        data
            .slice()
            .filter(t => t.locoTypeId == id)
            .forEach(t => {
                const opt = createOption(t.id, `${t.title}`);
                locoSeries.appendChild(opt);
            });
    }

    async function loadRailways() {
        try {
            const result = await fetch(URI + '/railways', {
                headers: {'Accept': 'application/json'},
                credentials: 'include'
            });

            if (!result) {
                displayMessage(currentMessage, 'Ошибка загрузки списка железных дорог', false);
                throw new Error(`HTTP: ${result.status}`);
            }

            const data = await result.json();
            sessionStorage.setItem('railways', JSON.stringify(data));
            return data;
        } catch (err) {
            displayMessage(currentMessage, 'Не удалось загрузить список железных дорог', false);
            railway.innerHTML = '<option value="" disabled selected>Ошибка загрузки</option>';
            railway.disabled = true;
        }
    }

    async function renderRailways(data, select) {
        select.replaceChildren();
        const placeholder = createDefaultOption('железная дорога');
        select.appendChild(placeholder);

        data
            .slice()
            .forEach(r => {
                const opt = createOption(r.id, `${r.abbreviation}`);
                select.appendChild(opt);
            });
    }

    async function getAllLocomotiveDepots() {
        try {
            const result = await fetch(URI + '/locomotive-depots', {
                headers: {'Accept': 'application/json'},
                credentials: 'include'
            });

            if (!result.ok) {
                displayMessage(currentMessage, 'Ошибка загрузки списка депо', false);
                throw new Error(`HTTP: ${result.status}`);
            }

            const data = await result.json();
            sessionStorage.setItem('locomotive-depots', JSON.stringify(data));
            return data;
        } catch (err) {
            displayMessage(currentMessage, 'Не удалось загрузить список локомотивных депо', false);
            locoDepot.innerHTML = '<option value="" disabled selected>Ошибка загрузки</option>';
            locoDepot.disabled = true;
        }
    }

    async function renderLocomotiveDepots(data, id) {
        locoDepot.replaceChildren();
        const placeholder = createDefaultOption('выберите депо приписки');
        locoDepot.appendChild(placeholder);

        data
            .slice()
            .filter(d => d.railwayId == id)
            .forEach(d => {
                const opt = createOption(d.id, `${d.shortTitle}`);
                locoDepot.appendChild(opt);
            });
    }

    async function evaluateTrainSecuring() {
        const cargoRatio = cargo.innerText === 'ГРУЖЁНОГО' ? 0.3 : 0.8;
        const carBrakingRatio = carBraking.innerText === 'НЕРАЗДЕЛЬНОЕ' ? 4 : 2;

        const locoShoesData = locoShoes.value.split('-');
        const numberOfLocoShoes = locoShoesData.length > 1 ?
            Number(locoShoesData[0]) - Number(locoShoesData[1]) : locoShoesData[0];
        const weightByBrakeShoes = Number(numberOfLocoShoes) * 100 / cargoRatio;

        let numberOfHandBrakes;
        if (weightByBrakeShoes > Number(trainWeight.value)) {
            const ratio = cargoRatio === 0.3 ? 333.333 : 125;
            const locoShoesRequired = Math.ceil((trainWeight.value) / ratio);
            trainSecuring.value  = `${locoShoesRequired}ТБ`;
        } else {
            numberOfHandBrakes = (Number(trainWeight.value) - weightByBrakeShoes) * 0.8 / 100 / carBrakingRatio;
            trainSecuring.value = `${numberOfLocoShoes}ТБ - ${Math.ceil(numberOfHandBrakes)}РТ`;
        }
    }

    async function getStationsByRailway(id) {
        try {
            const result = await fetch(URI + `/stations/railway/${id}`, {
                headers: {'Accept': 'application/json'},
                credentials: 'include'
            });

            if (!result.ok) {
                displayMessage(currentMessage, 'Ошибка загрузки станций заданной дороги', false);
                throw new Error(`HTTP ${result.status}`);
            }

            return await result.json();
        } catch (err) {
            displayMessage(currentMessage, 'Не удалось загрузить станции выбранной дороги', false);
            reportPoint.innerHTML = '<option value="" disabled selected>Ошибка загрузки</option>';
            reportPoint.disabled = true;
        }
    }
});
