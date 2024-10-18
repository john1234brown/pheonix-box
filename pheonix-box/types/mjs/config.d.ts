export interface iConfig {
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
}
/**
 * Class representing the configuration settings.
 */
export declare class Config {
    #private;
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
    getConfig(): any;
}
