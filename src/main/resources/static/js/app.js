const URI = '/api/v1';

let currentProfilePromise = null;
async function loadProfile() {
    if (currentProfilePromise) return currentProfilePromise;

    currentProfilePromise = (async () => {
        try {
            const me = await fetch('/api/auth/me', { credentials: 'include' });
            if (me.status === 401) { window.location.href = '/login'; return null; }
            if (!me.ok) throw new Error(`HTTP ${me.status}`);
            return await me.json();
        } catch (err) {
            console.error('.:: Ошибка загрузки данных профиля:', err);
            currentProfilePromise = null;
            return null;
        }
    })();

    return currentProfilePromise;
}

function renderProfile(data) {
    if (!data) return;
    const el = document.getElementById('username');
    if (el) el.textContent = `${data.username} (${data.role})`;

    const btn = document.getElementById('logout');
    if (btn) {
        btn.addEventListener('click', async () => {
            await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
            window.location.href = '/login';
        }, { once: true });
    }
}

function createDefaultOption(text) {
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.textContent = text;

    return placeholder;
}

function createOption(val, content) {
    const option = document.createElement('option');
    option.value = val;
    option.textContent = content;

    return option;
}

function displayMessage(paragraph, message, success) {
    paragraph.style.color = success ? 'yellowgreen' : 'indianred';
    paragraph.innerText = message;
    setTimeout(function() {
        paragraph.innerText = '\u00A0';
    }, 3000);
}

function inputDigits(event, field, numberOfDigits, func) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab', 'Enter'];
    if (allowedKeys.includes(event.key)) {
        if (event.key.includes('Enter') || event.key.includes('Tab')) {
            func();
        }
        return;
    }
    if(!/^\d$/.test(event.key) || field.value.length > numberOfDigits) {
        event.preventDefault();
    }
}
