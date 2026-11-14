const accountButton = document.getElementById('accountButton');

document.addEventListener("DOMContentLoaded", async () => {
    renderProfile(await loadProfile());
    await mountUserReminder()
});

accountButton.onclick = () => {
    window.location.href = '/account';
}