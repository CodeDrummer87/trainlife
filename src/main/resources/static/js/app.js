const URI = '/api/v1';

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
    }, 2500);
}

function checkAvailableInput(input, digits) {
    input.addEventListener('keydown', function (event) {
        const allowedInput = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace'];
        if (!allowedInput.includes(event.key) || input.value.length > digits - 1) {
            if (event.key !== 'Backspace')
                event.preventDefault();
        }
    }, {once: true});
}
