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

const fileDialog = new IdentifiableElement('file-dialog');

const scriptContent = new IdentifiableElement('script-content');

const uploadFileButton = new IdentifiableElement('upload-file-button');

const saveAsFileButton = new IdentifiableElement('save-as-file-button');

const deobfuscateButton = new IdentifiableElement('deobfuscate-button');

const refreshButtonUsablility = () => 
{
    let isContentAreaEmpty = !scriptContent.value;
    saveAsFileButton.element.disabled = isContentAreaEmpty;
    deobfuscateButton.element.disabled = isContentAreaEmpty;
}

//
//  Setup event listeners.
//

document.addEventListener('readystatechange', () => 
{
    if (document.readyState !== 'complete') { return; }

    fileDialog.listen('change', (dialog) => 
    {
        let file = dialog.files[0];
        if (!file) { return; }

        let reader = new FileReader();

        reader.addEventListener('load', () => 
        {
            scriptContent.value = reader.result;
            refreshButtonUsablility();
        });

        reader.addEventListener('loadend', () => dialog.value = null);
        reader.readAsText(file);
    });

    uploadFileButton.listen('click', () => 
    {
        console.log('Getting existing file...');
        fileDialog.element.click();
    });

    saveAsFileButton.listen('click', () => 
    {
        console.log('Downloading...');

        let content = scriptContent.value;
        let filetype = 'text/plain';
        let blob = new Blob([content], {type: filetype});
        let link = document.createElement('a');

        link.download = 'deobfuscated.sk';
        link.href = window.URL.createObjectURL(blob);
        link.dataset.downloadurl = `${filetype}:${link.download}:${link.href}`;
        link.click();
        link.remove();
    });
    
    deobfuscateButton.listen('click', () => 
    {
        console.log('Deobfuscating...');

        let content = scriptContent.value;
        let results = deobfuscate(content.split('\n'));
        scriptContent.value = results.join('\n');
    });

    scriptContent.listen('input', refreshButtonUsablility);
});
