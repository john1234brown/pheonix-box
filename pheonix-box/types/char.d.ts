/************************************************************************************************************************
 * Author: Johnathan Edward Brown                                                                                       *
 * Purpose: Generate safe UTF-8 characters for use in the PheonixBox Class Object for the CLI Pheonix application.      *
 * Last Modified: 2024-10-14                                                                                            *
 * License: X11 License                                                                                                 *
 * Version: 1.0.2                                                                                                       *
 ************************************************************************************************************************/
/**
 * Generates an array of safe UTF-8 characters, excluding certain control characters and other specified characters.
 *
 * @param count - The number of additional spaces to append to the array of safe characters.
 * @returns An array of safe UTF-8 characters.
 *
 * @remarks
 * The function excludes characters such as backslashes, backticks, dollar signs, escape characters, and other control characters.
 * It also skips surrogate pairs and C1 control characters.
 * The resulting characters are filtered to ensure they are within the byte range of the UTF-8 format.
 *
 * @example
 * ```typescript
 * const safeChars = generateSafeUtf8Characters(5);
 * console.log(safeChars);
 * ```
 */
export declare function generateSafeUtf8Characters(count: number): string[];
/**
 * Generates an array of safe UTF-8 characters for AES encryption.
 *
 * This function filters out characters that are not safe for AES encryption,
 * such as control characters, surrogate pairs, and other excluded characters.
 * It ensures that the generated characters are within the byte range suitable for AES.
 *
 * @param {number} count - The number of safe UTF-8 characters to generate.
 * @returns {string[]} An array of safe UTF-8 characters for AES encryption.
 */
export declare function generateSafeUtf8CharactersForAES(count: number): string[];
