export function generateSafeUtf8Characters(count: number): string[] {
    const excludedCharacters = [
        '\\', '`', '$', '\x1B', '\uFFFD', '\b', '\f', '\n', '\r', '\t', '\v', '\0', 
        '\'', '\"', '\u2028', '\u2029', '\uD800-\uDFFF', '\uFFFE', '\uFFFF'
    ]; // Add more exclusions as needed
    const safeCharacters: string[] = [];
    
    for (let i = 32; i < 0x10FFFF; i++) { // UTF-8 characters range from 32 to 0x10FFFF
        if (i >= 0xD800 && i <= 0xDFFF) continue; // Skip surrogate pairs
        if (i >= 0x7F && i <= 0x9F) continue; // Skip C1 control characters
        const char = String.fromCodePoint(i);
        if (!excludedCharacters.includes(char) && char.trim().length > 0) {
            safeCharacters.push(char);
        }
    }

    for (let i = 0; i < count; i++){
        safeCharacters.push('  ');
    }
//    console.log('safeCharacters:', safeCharacters.join(''));
    console.log('safeCharacters:', safeCharacters.join('').length);
    return safeCharacters;
}


export function generateSafeUtf8CharactersForAES(count: number): string[] {
    const excludedCharacters = [
        '\\', '`', '$', '\x1B', '\uFFFD', '\b', '\f', '\n', '\r', '\t', '\v', '\0', 
        '\'', '\"', '\u2028', '\u2029', '\uD800-\uDFFF', '\uFFFE', '\uFFFF'
    ]; // Add more exclusions as needed
    const safeCharacters: string[] = [];
    
    for (let i = 32; i < 0x10FFFF; i++) { // UTF-8 characters range from 32 to 0x10FFFF
        if (i >= 0xD800 && i <= 0xDFFF) continue; // Skip surrogate pairs
        if (i >= 0x7F && i <= 0x9F) continue; // Skip C1 control characters
        const char = String.fromCodePoint(i);
        if (!excludedCharacters.includes(char) && char.trim().length > 0) {
            safeCharacters.push(char);
        }
    }

    // AES encryption typically works with bytes, so we need to ensure the characters are within the byte range
    const aesSafeCharacters = safeCharacters.filter(char => char.charCodeAt(0) <= 0xFF);

    for (let i = 0; i < count; i++){
//        aesSafeCharacters.push(' ');
    }
//    console.log('aesSafeCharacters:', aesSafeCharacters.join(''));
    console.log('aesSafeCharacters:', aesSafeCharacters.join('').length);
    return aesSafeCharacters;
}

//console.log(generateSafeUtf8Characters(32)); //Generate with random off spaces of white spaces!