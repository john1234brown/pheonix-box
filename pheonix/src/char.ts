export function generateSafeUtf8Characters(count: number): string[] {
    const excludedCharacters = [
        '\\', '`', '$', '\x1B', '\uFFFD', '\b', '\f', '\n', '\r', '\t', '\v', '\0', 
        '\'', '\"', '\u2028', '\u2029', '\uD800-\uDFFF', '\uFFFE', '\uFFFF'
    ]; // Add more exclusions as needed
    const safeCharacters: string[] = [];
    
    for (let i = 32; i < 0x10FFFF; i++) { // UTF-8 characters range from 32 to 0x10FFFF
        if (i >= 0xD800 && i <= 0xDFFF) continue; // Skip surrogate pairs
        const char = String.fromCodePoint(i);
        if (!excludedCharacters.includes(char)) {
            safeCharacters.push(char);
        }
    }

    for (let i = 0; i < count; i++){
        safeCharacters.push(' ');
    }
//    console.log('safeCharacters:', safeCharacters.join(''));
    console.log('safeCharacters:', safeCharacters.join('').length);
    return safeCharacters;
}

//console.log(generateSafeUtf8Characters(32)); //Generate with random off spaces of white spaces!