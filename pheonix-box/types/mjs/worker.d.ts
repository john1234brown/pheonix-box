/************************************************************************************************************************
 * Author: Johnathan Edward Brown                                                                                       *
 * Purpose: Worker class for the PheonixBox Class Object for the CLI Pheonix application.                               *
 * Last Modified: 2024-10-18                                                                                            *
 * License: X11 License                                                                                                 *
 * Version: 1.0.2                                                                                                       *
 ************************************************************************************************************************/
import { Config } from './config';
/**
 * Represents a collection of file hashes where the key is the file path
 * and the value is the corresponding hash string.
 *
 * @interface FileHashes
 * @property {string} [key] - The file path.
 * @property {string} value - The hash string associated with the file.
 */
interface FileHashes {
    [key: string]: string;
}
/**
 * Represents the contents of a file where each key is a string
 * and the corresponding value is also a string.
 */
interface FileContents {
    [key: string]: string;
}
/**
 * The `JohnsWorker` class is responsible for processing files, encrypting, and decrypting their contents.
 * It supports both Caesar cipher and AES-256-CBC encryption methods.
 *
 * @class
 * @param {Config} config - Configuration object for the worker.
 * @param {string[]} fileList - List of file paths to be processed.
 * @param {any} chunks - Data chunks to be processed.
 * @param {string} cipherKey - Key used for Caesar cipher encryption.
 * @param {string} shuffledKey - Shuffled key used for Caesar cipher decryption.
 * @param {Buffer} aesKey - Key used for AES-256-CBC encryption.
 * @param {boolean} loaded - Indicates if the worker is loaded.
 * @param {FileHashes} [fileHashes] - Optional precomputed file hashes.
 * @param {FileContents} [fileContents] - Optional precomputed file contents.
 *
 * @property {Config} config - Configuration object for the worker.
 * @property {FileHashes} fileHashes - Object storing file hashes.
 * @property {FileContents} fileContents - Object storing file contents.
 * @property {string} cipherKey - Key used for Caesar cipher encryption.
 * @property {string} shuffledKey - Shuffled key used for Caesar cipher decryption.
 * @property {Buffer} aesKey - Key used for AES-256-CBC encryption.
 * @property {boolean} loaded - Indicates if the worker is loaded.
 *
 * @method log - Logs messages if debug mode is enabled in the config.
 * @method encrypt - Encrypts a given text using Caesar cipher and optionally AES-256-CBC.
 * @method decrypt - Decrypts a given text using AES-256-CBC and Caesar cipher.
 * @method processFiles - Processes a list of files and updates their hashes and contents.
 * @method processFile - Processes a single file, updating its hash and content.
 * @method shouldProcessFile - Determines if a file should be processed based on the config.
 * @method terminate - Terminates the worker process.
 */
declare class JohnsWorker {
    #private;
    constructor(config: Config, fileList: string[], chunks: any, cipherKey: string, shuffledKey: string, aesKey: Buffer, loaded: boolean, fileHashes?: FileHashes, fileContents?: FileContents);
    /**
     * Logs messages to the console if debugging is enabled in the configuration.
     *
     * @param {...any[]} args - The messages or objects to log.
     */
    private log;
    /**
     * Processes a list of files and returns their hashes and contents.
     *
     * @param fileList - An array of file paths to be processed.
     * @param chunks - Data chunks to be used during file processing.
     * @returns A promise that resolves to an object containing file hashes and file contents.
     * @throws Will reject the promise if an error occurs during file processing.
     */
    processFiles(fileList: string[], chunks: any): Promise<{
        fileHashes: FileHashes;
        fileContents: FileContents;
    }>;
    /**
     * Terminates the worker process.
     *
     * This method logs a message indicating that the worker is terminating,
     * then exits the process with a status code of 0.
     * Note that any code after `process.exit(0)` will not be executed.
     */
    terminate(): void;
}
export default JohnsWorker;
