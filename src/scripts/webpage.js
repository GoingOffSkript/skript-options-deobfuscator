'use strict';

// Skript Deobfuscator by RezzedUp
// Tested in Chrome v66.0.3359.139 (Official Build) (64-bit)

import { deobfuscate } from './deobfuscator.js';

let demo = 
`options:
    demo: hello
    @@{{: ;)

command /wow:
    trigger:
        send "{@demo}! {@@@{{}"
`;

console.log(deobfuscate(demo.split('\n')));

document.addEventListener('readystatechange', () => 
{
    if (document.readyState !== 'complete') { return; }

    document.getElementById('deobfuscate-button').addEventListener('click', (button) => 
    {
        console.log('clicked - deobfuscating...');

        let textArea = document.getElementById('script-content');
        let content = textArea.value || '';
        let results = deobfuscate(content.split('\n'));
        textArea.value = results.join('\n');
    });
});
