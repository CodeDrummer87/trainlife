const newTripButton = document.getElementById('newTripButton');

document.addEventListener("DOMContentLoaded", async () => {
    renderProfile(await loadProfile());
    await mountUserReminder()
});

newTripButton.onclick = () => {
    window.location.href = '/new-trip';
}

