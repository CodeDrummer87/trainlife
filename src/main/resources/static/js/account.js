const currentMessage = document.getElementById('currentMessage');

const reminderTab = document.getElementById('reminderTab');
const position_and_fullname = document.getElementById('position_and_fullname');
const long_personnel_number = document.getElementById('long_personnel_number');
const traction_service = document.getElementById('traction_service');
const railway_full_title = document.getElementById('railway_full_title');

document.addEventListener("DOMContentLoaded", async () => {
    await getCurrentUser();
});

async function getCurrentUser() {
    try {
        const result = await fetch(URI + '/users/current', {
            credentials: 'include'
        });

        // защита от редиректа на HTML (истёкший токен → EntryPoint → /login)
        const contentType = result.headers.get('Content-Type') || '';
        if (!contentType.includes('application/json')) {
            window.location.href = '/login';
            return null;
        }

        if (result.status === 401) {
            window.location.href = '/login';
            return null;
        }

        if (!result.ok) {
            throw new Error(`HTTP ${result.status}`);
        }

        const user = await result.json();
        await renderUser(user);
        return user;
    } catch (err) {
        console.error('.:: Ошибка загрузки данных пользователя:', err);
        displayMessage(currentMessage, 'Ошибка загрузки данных пользователя', false);
        return null;
    }
}

async function renderUser(user) {
    reminderTab.innerText = `.:: ${user.locomotiveDepotAbbreviation.replace('-', '★')} (${user.railwayAbbreviation})`;
    railway_full_title.innerText = user.railwayFullTitle;

    const fullName = user.fullName.split(' ');
    position_and_fullname.innerText = `${user.positionAbbreviate} ${fullName[0]} ${fullName[1].charAt(0)}.${fullName[2].charAt(0)}. 
    (таб.№ ${user.personnelNumber}, колонна № ${user.numberOfColumn})`;
    traction_service.innerText = `(${user.tractionKindTitle}, ${user.serviceTypeTitle} движение)`;
    long_personnel_number.innerText = `Таб.№ в ЕКАСУТР: ${user.longPersonnelNumber}`;
}
