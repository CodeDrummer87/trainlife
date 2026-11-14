let currentUserPromise = null;

const REMINDER_TEMPLATE = `
<div class="reminder" id="reminder">
    <button class="reminder-tab" id="reminderTab" aria-label="Открыть панель"></button>
    <div class="reminder-content">
        <h2 id="railway_full_title"></h2>
        <hr>
        <p id="position_and_fullname"></p>
        <p id="traction_service"></p>
        <p id="long_personnel_number"></p>
    </div>
</div>`;

function ensureReminderMarkup() {
    if (document.getElementById('reminder')) return;
    document.body.insertAdjacentHTML('afterbegin', REMINDER_TEMPLATE);

    const drawer = document.getElementById('reminder');
    drawer.addEventListener('click', (e) => {
        e.stopPropagation();
        drawer.classList.toggle('open');
    });
}

async function fetchCurrentUser() {
    if (currentUserPromise) return currentUserPromise;

    currentUserPromise = (async () => {
        try {
            const result = await fetch(URI + '/users/current',
                { credentials: 'include' });

            const contentType = result.headers.get('Content-Type') || '';
            if (!contentType.includes('application/json')) {
                window.location.href = '/login';
                return null;
            }
            if (result.status === 401) {
                window.location.href = '/login';
                return null;
            }
            if (!result.ok) throw new Error(`HTTP ${result.status}`);

            return await result.json();
        } catch (err) {
            console.error('.:: Ошибка загрузки данных пользователя:', err);
            currentUserPromise = null;
            return null;
        }
    })();

    return currentUserPromise;
}

function renderReminder(user) {
    const reminderTab        = document.getElementById('reminderTab');
    const railway_full_title = document.getElementById('railway_full_title');
    const position_and_fullname = document.getElementById('position_and_fullname');
    const traction_service   = document.getElementById('traction_service');
    const long_personnel_number = document.getElementById('long_personnel_number');

    if (!reminderTab) return;

    reminderTab.innerText = `.:: ${user.locomotiveDepotAbbreviation.replace('-', '★')} (${user.railwayAbbreviation})`;
    railway_full_title.innerText = user.railwayFullTitle;

    const fullName = user.fullName.split(' ');
    position_and_fullname.innerText =
        `${user.positionAbbreviate} ${fullName[0]} ${fullName[1].charAt(0)}.${fullName[2].charAt(0)}. ` +
        `\nТаб.№ ${user.personnelNumber}, колонна № ${user.numberOfColumn}`;
    traction_service.innerText = `(${user.tractionKindTitle}, ${user.serviceTypeTitle} движение)`;
    long_personnel_number.innerText = `Таб.№ в ЕКАСУТР: ${user.longPersonnelNumber}`;
}

async function mountUserReminder() {
    ensureReminderMarkup();
    const user = await fetchCurrentUser();
    if (user) renderReminder(user);
    return user;
}