document.addEventListener("DOMContentLoaded", async () => {
    const newTripButton = document.getElementById('newTripButton');

    renderProfile(await loadProfile());
    await mountUserReminder()

    newTripButton.onclick = () => {
        window.location.href = '/new-trip';
    }
});
