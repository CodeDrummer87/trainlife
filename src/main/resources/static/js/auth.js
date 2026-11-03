async function login(username, password) {
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
    });
    if (res.ok) {
        const data = await res.json();
        if (data.role === 'ROLE_ADMIN') window.location.href = '/admin';
        else window.location.href = '/account';
        return true;
    }
    const err = await res.json().catch(() => ({}));
    document.getElementById('error').textContent = err.error || 'Login failed';
    return false;
}

async function register(username, password) {
    const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
    });
    if (res.ok) return true;
    const err = await res.json().catch(() => ({}));
    document.getElementById('error').textContent = err.error || 'Register failed';
    return false;
}

async function loadProfile() {
    const me = await fetch('/api/auth/me', { credentials: 'include' });
    if (me.status === 401) {
        window.location.href = '/login'; return;
    }
    const data = await me.json();
    const el = document.getElementById('username');
    if (el) {
        el.textContent = data.username + ' (' + data.role + ')';
    }

    const btn = document.getElementById('logout');
    if (btn) btn.addEventListener('click', async () => {
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
        window.location.href = '/login';
    });
}