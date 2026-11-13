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
    }, 3000);
}

function inputDigits(event, field, numberOfDigits, func) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
    if (allowedKeys.includes(event.key)) {
        return;
    }
    if(!/^\d$/.test(event.key) || field.value.length > numberOfDigits) {
        event.preventDefault();
        if (event.key === 'Enter' || event.key === 'Tab') {
            func();
        }
    }
}
