/**
 * Class representing the configuration settings.
 */
declare class Config {
    /**
     * Path to the configuration file.
     */
    private configFilePath;
    /**
     * Configuration object containing various settings.
     */
    private config;
    paths: string[];
    excludePaths: string[];
    fileTypes: string[];
    fileRegexs: string[];
    useFileTypes: boolean;
    useFileRegexs: boolean;
    useCeaserCipher: boolean;
    useAesKey: boolean;
    forkDelay: number;
    forkExecutionDelay: number;
    threads: number;
    whiteSpaceOffset: number;
    debug: boolean;
    localPathReferences: boolean;
    selfTamperProof: boolean;
    selfNpmTamperProof: boolean;
    /**
     * Creates an instance of Config.
     * @param configObject - Optional configuration object to initialize with.
     */
    constructor(configObject?: any);
    /**
     * Logs a message if debug mode is enabled.
     * @param message - The message to log.
     */
    private log;
    /**
     * Saves the current configuration to the configuration file.
     */
    private saveConfig;
    /**
     * Validates the given configuration object.
     * @param config - The configuration object to validate.
     * @returns True if the configuration is valid, false otherwise.
     */
    private validateConfig;
    /**
     * Loads the configuration from the configuration file.
     */
    private loadConfig;
    /**
     * Saves the current configuration to the configuration file.
     * This method is public and updates the internal configuration before saving.
     */
    saveConfigP(): void;
    /**
     * Adds a path to the configuration.
     * @param path - The path to add.
     */
    addPath(path: string): void;
    /**
     * Removes a path from the configuration.
     * @param path - The path to remove.
     */
    removePath(path: string): void;
    /**
     * Adds an exclude path to the configuration.
     * @param path - The exclude path to add.
     */
    addExcludePath(path: string): void;
    /**
     * Removes an exclude path from the configuration.
     * @param path - The exclude path to remove.
     */
    removeExcludePath(path: string): void;
    /**
     * Adds a file type to the configuration.
     * @param fileType - The file type to add.
     */
    addFileType(fileType: string): void;
    /**
     * Removes a file type from the configuration.
     * @param fileType - The file type to remove.
     */
    removeFileType(fileType: string): void;
    /**
     * Adds a file regex to the configuration.
     * @param regex - The file regex to add.
     */
    addFileRegex(regex: string): void;
    /**
     * Removes a file regex from the configuration.
     * @param regex - The file regex to remove.
     */
    removeFileRegex(regex: string): void;
}

/************************************************************************************************************************
 * Author: Johnathan Edward Brown                                                                                       *
 * Purpose: Main entry point for the PheonixBox Class Object for the CLI Pheonix application.                           *
 * Last Modified: 2024-10-14                                                                                            *
 * License: X11 License                                                                                                 *
 * Version: 1.0.4                                                                                                       *
 ************************************************************************************************************************/

/**
 * The `JohnsPheonixBox` class provides functionality for managing file hashes, contents, and encryption keys.
 * It supports runtime protection, state saving/loading, and multi-threaded processing.
 */
declare class JohnsPheonixBox {
    private config;
    private fileHashes;
    private fileContents;
    private cipherKey;
    private shuffledKey;
    private safeAsciiCharacters;
    private aesKey;
    private loaded;
    /**
     * Initializes a new instance of the `JohnsPheonixBox` class.
     *
     * @param {Config} [config] - Optional configuration object.
     * @param {boolean} [useSeaAsset=false] - Whether to use a SEA asset for configuration.
     * @param {string} [assetLocation=''] - The location of the SEA asset.
     */
    constructor(config?: Config, useSeaAsset?: boolean, assetLocation?: string);
    private log;
    /**
     * Initializes runtime protection for the application.
     *
     * @param {boolean} [npm] - If true, enables npm tamper-proof protection.
     * @param {boolean} [binary] - If true, enables binary tamper-proof protection.
     * @param {boolean} [localReferences] - If true, adds local file references to the configuration.
     * @param {boolean} [dirname] - If true, uses `__dirname` for path resolution; otherwise, uses `process.cwd()`.
     *
     * @remarks
     * - When `npm` is true, the method configures paths for npm tamper-proof protection.
     * - When `binary` is true, the method configures paths for binary tamper-proof protection.
     * - If `localReferences` is true, it adds the current file and 'node_modules' to the configuration paths.
     * - If `dirname` is true, it uses `__dirname` for path resolution; otherwise, it uses the current working directory.
     * - The method ensures that tamper-proof protection is enabled only if it is not already set.
     */
    initRuntimeProtect(npm?: boolean, binary?: boolean, localReferences?: boolean, dirname?: boolean): void;
    /**
     * Loads the configuration from a SEA asset.
     *
     * @param {string} assetLocation - The location of the SEA asset.
     * @returns {Config} The loaded configuration object.
     */
    private loadConfigFromSeaAsset;
    /**
     * Loads the state from a file.
     */
    private loadState;
    /**
     * Saves the current state to a file.
     */
    private saveState;
    /**
     * Starts the process, managing worker threads and distributing tasks.
     */
    startProcess(): void;
    /**
     * Generates a list of files to be processed.
     *
     * @returns {string[]} The list of file paths.
     */
    private getFileList;
    /**
     * Generates a cipher key by shuffling safe ASCII characters.
     *
     * @returns {string} The generated cipher key.
     */
    private generateCipherKey;
    /**
     * Shuffles an array of strings.
     *
     * @param {string[]} array - The array of strings to shuffle.
     * @returns {string[]} The shuffled array.
     */
    private shuffleKeys;
    /**
     * Shuffles a given key string.
     *
     * @param {string} key - The key string to shuffle.
     * @returns {string} The shuffled key.
     */
    private shuffleKey;
}

export { JohnsPheonixBox as default };
