async function login(username, password, currentMessage) {
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
    });
    if (res.ok) {
        const data = await res.json();
        if (data.role === 'ROLE_ADMIN') window.location.href = '/admin';
        else {
            window.location.href = !data.wasIntroduced ? '/introduce' : '/account';
        }
        return true;
    }
    const err = await res.json().catch(() => ({}));
    displayMessage(currentMessage, err.error, false);
    return false;
}

async function register(username, password, currentMessage) {
    const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
    });
    if (res.ok) return true;
    const err = await res.json().catch(() => ({}));
    displayMessage(currentMessage, err.error, false);
    return false;
}
