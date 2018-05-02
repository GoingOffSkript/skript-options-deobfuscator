'use strict';

// Skript Deobfuscator by RezzedUp
// Tested with Chrome v66.0.3359.139 (Official Build) (64-bit)

const Patterns = 
{
    COMMENT: /(?:^|[^#])(#(?:$|[^#]).*)/,

    SCOPE: /^[\0\s]*(?<scope>\w+).*:\s*$/,

    OPTIONS_KEY_DEFINITION: /(?:(?: |\t)+)(?<key>[^:]+):(?: |\t)*(?<value>.+)/,

    INLINE_OPTIONS_PLACEHOLDERS: /\{@([^}]+)\}/g,

    OPTIONS_PLACEHOLDER_KEY: /\{@(?<key>[^}]+)\}/
}

/**
 * @param {string[]} lines
 * @returns {string[]}
 */
export const deobfuscate = (lines) => 
{
    let context = {scope: '', keys: {}};
    return lines.map(stripComments).map(line => determineScope(line, context)).filter(line => line && true);
}

/**
 * @param {string} line 
 * @returns {string}
 */
const stripComments = (line) => line.replace(Patterns.COMMENT, '');

/**
 * @param {string} line 
 * @param {*} context 
 * @returns {string}
 */
const determineScope = (line, context) =>
{
    let match = line.match(Patterns.SCOPE);
    if (match) { context.scope = match.groups.scope.toLowerCase(); }

    let isWithinOptions = context.scope === 'options';
    if (match) { return (isWithinOptions) ? null : line; }

    let handleScope = (isWithinOptions) ? handleOptionsScope : handleDefaultScope;
    return handleScope(line, context);
}

/**
 * @param {string} line 
 * @param {*} context 
 * @returns {string}
 */
const handleOptionsScope = (line, context) =>
{
    let match = line.match(Patterns.OPTIONS_KEY_DEFINITION);
    if (match) { context.keys[match.groups.key] = match.groups.value; }
    return null;
}

/**
 * @param {string} line 
 * @param {*} context 
 * @returns {string}
 */
const handleDefaultScope = (line, context) => 
{
    let options = line.match(Patterns.INLINE_OPTIONS_PLACEHOLDERS);
    if (!options) { return line; }

    let updated = line;
    options.forEach(placeholder => 
    {
        let key = placeholder.match(Patterns.OPTIONS_PLACEHOLDER_KEY).groups.key;
        let value = context.keys[key] || placeholder;
        updated = updated.replace(placeholder, value);
    });
    return updated;
}
