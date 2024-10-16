/**
 * Configuration interface for the Pheonix Box CLI worker.
 *
 * @interface Config
 *
 * @property {boolean} debug - Indicates whether debugging is enabled.
 * @property {boolean} useAesKey - Specifies if AES key encryption should be used.
 * @property {boolean} useCeaserCipher - Specifies if Caesar cipher encryption should be used.
 * @property {boolean} [useFileTypes] - Optional flag to determine if specific file types should be used.
 * @property {string[]} [fileTypes] - Optional array of file types to include.
 * @property {boolean} [useFileRegexs] - Optional flag to determine if file regex patterns should be used.
 * @property {string[]} [fileRegexs] - Optional array of regex patterns for file matching.
 * @property {string[]} [excludePaths] - Optional array of paths to exclude.
 */
interface Config {
    debug: boolean;
    useAesKey: boolean;
    useCeaserCipher: boolean;
    useFileTypes?: boolean;
    fileTypes?: string[];
    useFileRegexs?: boolean;
    fileRegexs?: string[];
    excludePaths?: string[];
}
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
    private config;
    private fileHashes;
    private fileContents;
    private cipherKey;
    private shuffledKey;
    private aesKey;
    private loaded;
    constructor(config: Config, fileList: string[], chunks: any, cipherKey: string, shuffledKey: string, aesKey: Buffer, loaded: boolean, fileHashes?: FileHashes, fileContents?: FileContents);
    /**
     * Logs messages to the console if debugging is enabled in the configuration.
     *
     * @param {...any[]} args - The messages or objects to log.
     */
    private log;
    /**
     * Encrypts the given text using a Caesar cipher and optionally AES encryption.
     *
     * @param text - The text to be encrypted.
     * @returns The encrypted text. If AES encryption is used, the result will include the initialization vector.
     *
     * @remarks
     * - The method first applies a Caesar cipher using a shuffled key.
     * - If AES encryption is enabled and an AES key is provided, the method further encrypts the result using AES-256-CBC.
     * - Logs the encryption process at various stages.
     */
    private encrypt;
    /**
     * Decrypts the given text using AES-256-CBC and a Caesar cipher.
     *
     * @param text - The encrypted text to decrypt.
     * @returns The decrypted text.
     * @throws {Error} If the encrypted text format is invalid or the initialization vector length is incorrect.
     *
     * The decryption process involves:
     * 1. Logging the start of the decryption process.
     * 2. Checking if AES decryption is enabled and performing AES-256-CBC decryption if applicable.
     * 3. Using a Caesar cipher to further decrypt the text.
     * 4. Logging the decrypted text after applying the Caesar cipher.
     */
    private decrypt;
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
     * Processes a file by reading its content, computing its hash, and comparing it with stored values.
     * If the file should be processed and its hash does not match the stored hash, the file content is replaced
     * with the stored content. The file hash and content can be encrypted/decrypted based on the configuration.
     *
     * @param filePath - The path of the file to process.
     * @param chunks - Additional data or chunks related to the file processing (not used in the current implementation).
     */
    private processFile;
    /**
     * Determines whether a file should be processed based on the configuration settings.
     *
     * @param filePath - The path of the file to check.
     * @returns `true` if the file should be processed, `false` otherwise.
     *
     * The method performs the following checks:
     * - Logs the file path being checked.
     * - Checks if the file path is excluded based on the `excludePaths` configuration.
     * - If `useFileTypes` is enabled, checks if the file extension is included in the `fileTypes` configuration.
     * - If `useFileRegexs` is enabled, checks if the file name matches any of the regular expressions in the `fileRegexs` configuration.
     */
    private shouldProcessFile;
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
