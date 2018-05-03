'use strict';

// Skript Deobfuscator by RezzedUp
// Tested with Chrome v66.0.3359.139 (Official Build) (64-bit)

import { deobfuscate } from './deobfuscator.js';

//
//  DOM elements.
//

class IdentifiableElement
{
    constructor(id) { this.id = id; }

    get element() { return document.getElementById(this.id); }

    get value() { return this.element.value || ''; }

    set value(text) { this.element.value = text; }

    listen(event, callback) { this.element.addEventListener(event, () => callback(this.element)); }
}

const FILE_DIALOG = new IdentifiableElement('file-dialog');

const SCRIPT_CONTENT = new IdentifiableElement('script-content');

const UPLOAD_FILE_BUTTON = new IdentifiableElement('upload-file-button');

const SAVE_AS_FILE_BUTTON = new IdentifiableElement('save-as-file-button');

const DEOBFUSCATE_BUTTON = new IdentifiableElement('deobfuscate-button');

const refreshButtonUsablility = () => 
{
    let isContentAreaEmpty = !SCRIPT_CONTENT.value;
    SAVE_AS_FILE_BUTTON.element.disabled = isContentAreaEmpty;
    DEOBFUSCATE_BUTTON.element.disabled = isContentAreaEmpty;
}

//
//  Setup event listeners.
//

document.addEventListener('readystatechange', () => 
{
    if (document.readyState !== 'complete') { return; }

    FILE_DIALOG.listen('change', (fileDialog) => 
    {
        let file = fileDialog.files[0];
        if (!file) { return; }

        let reader = new FileReader();

        reader.addEventListener('load', () => 
        {
            SCRIPT_CONTENT.value = reader.result;
            refreshButtonUsablility();
        });

        reader.addEventListener('loadend', () => fileDialog.value = null);
        reader.readAsText(file);
    });

    UPLOAD_FILE_BUTTON.listen('click', () => 
    {
        console.log('Getting existing file...');
        FILE_DIALOG.element.click();
    });

    SAVE_AS_FILE_BUTTON.listen('click', () => 
    {
        console.log('Downloading...');

        let content = SCRIPT_CONTENT.value;
        let filetype = 'text/plain';
        let blob = new Blob([content], {type: filetype});
        let link = document.createElement('a');

        link.download = 'deobfuscated.sk';
        link.href = window.URL.createObjectURL(blob);
        link.dataset.downloadurl = `${filetype}:${link.download}:${link.href}`;
        link.click();
        link.remove();
    });
    
    DEOBFUSCATE_BUTTON.listen('click', () => 
    {
        console.log('Deobfuscating...');

        let content = SCRIPT_CONTENT.value;
        let results = deobfuscate(content.split('\n'));
        SCRIPT_CONTENT.value = results.join('\n');
    });

    SCRIPT_CONTENT.listen('input', refreshButtonUsablility);
});
