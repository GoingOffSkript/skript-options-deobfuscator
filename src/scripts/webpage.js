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

document.addEventListener('ready', () => {
    
});

//document.onload
