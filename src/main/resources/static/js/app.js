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