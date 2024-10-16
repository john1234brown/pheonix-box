'use strict';

var require$$0 = require('fs');
var require$$1 = require('crypto');
var require$$2 = require('path');
var require$$4 = require('node:sea');
var require$$7 = require('cluster');
var require$$8 = require('os');

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var main$1 = {};

var config = {};

var hasRequiredConfig;

function requireConfig () {
	if (hasRequiredConfig) return config;
	hasRequiredConfig = 1;
	var __createBinding = (config && config.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (config && config.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (config && config.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(config, "__esModule", { value: true });
	config.Config = void 0;
	/************************************************************************************************************************
	 * Author: Johnathan Edward Brown                                                                                       *
	 * Purpose: Configuration class for the CLI Pheonix application.                                                        *
	 * Last Modified: 2024-10-14                                                                                            *
	 * License: X11 License                                                                                                 *
	 * Version: 1.0.2                                                                                                       *
	 ************************************************************************************************************************/
	const fs = __importStar(require$$0);
	/**
	 * Class representing the configuration settings.
	 */
	class Config {
	    /**
	     * Path to the configuration file.
	     */
	    configFilePath = 'configurable.json';
	    /**
	     * Configuration object containing various settings.
	     */
	    config;
	    paths;
	    excludePaths;
	    fileTypes;
	    fileRegexs;
	    useFileTypes;
	    useFileRegexs;
	    useCeaserCipher;
	    useAesKey;
	    forkDelay;
	    forkExecutionDelay;
	    threads;
	    whiteSpaceOffset;
	    debug;
	    localPathReferences;
	    selfTamperProof;
	    selfNpmTamperProof;
	    /**
	     * Creates an instance of Config.
	     * @param configObject - Optional configuration object to initialize with.
	     */
	    constructor(configObject) {
	        this.config = {
	            paths: [],
	            excludePaths: [],
	            fileTypes: [],
	            fileRegexs: [],
	            forkDelay: 1,
	            forkExecutionDelay: 1,
	            threads: 1,
	            useFileTypes: false,
	            useFileRegexs: false,
	            useCeaserCipher: false,
	            useAesKey: false,
	            debug: false,
	            whiteSpaceOffset: 0,
	            localPathReferences: false,
	            selfTamperProof: false,
	            selfNpmTamperProof: false,
	        };
	        if (configObject && this.validateConfig(configObject)) {
	            this.config = configObject;
	        }
	        else {
	            this.loadConfig();
	        }
	        this.paths = this.config.paths;
	        this.excludePaths = this.config.excludePaths;
	        this.fileTypes = this.config.fileTypes;
	        this.fileRegexs = this.config.fileRegexs;
	        this.useFileRegexs = this.config.useFileRegexs;
	        this.useFileTypes = this.config.useFileTypes;
	        this.useCeaserCipher = this.config.useCeaserCipher;
	        this.useAesKey = this.config.useAesKey;
	        this.forkDelay = this.config.forkDelay;
	        this.forkExecutionDelay = this.config.forkExecutionDelay;
	        this.threads = this.config.threads;
	        this.debug = this.config.debug;
	        this.whiteSpaceOffset = this.config.whiteSpaceOffset;
	        this.localPathReferences = this.config.localPathReferences;
	        this.selfTamperProof = this.config.selfTamperProof;
	        this.selfNpmTamperProof = this.config.selfNpmTamperProof;
	    }
	    /**
	     * Logs a message if debug mode is enabled.
	     * @param message - The message to log.
	     */
	    log(message) {
	        if (this.debug) {
	            console.log(message);
	        }
	    }
	    /**
	     * Saves the current configuration to the configuration file.
	     */
	    saveConfig() {
	        if (this.config.selfTamperProof || this.config.selfNpmTamperProof) {
	            console.error('Configuration is tamper-proof. Save aborted.');
	            return;
	        }
	        if (this.validateConfig(this.config)) {
	            fs.writeFileSync(this.configFilePath, JSON.stringify(this.config, null, 2));
	            this.log('Configuration saved successfully.');
	        }
	        else {
	            console.error('Invalid configuration. Save aborted.');
	        }
	    }
	    /**
	     * Validates the given configuration object.
	     * @param config - The configuration object to validate.
	     * @returns True if the configuration is valid, false otherwise.
	     */
	    validateConfig(config) {
	        if (!Array.isArray(config.paths))
	            return false;
	        if (!Array.isArray(config.excludePaths))
	            return false;
	        if (!Array.isArray(config.fileTypes))
	            return false;
	        if (!Array.isArray(config.fileRegexs))
	            return false;
	        if (typeof config.useFileTypes !== 'boolean')
	            return false;
	        if (typeof config.useFileRegexs !== 'boolean')
	            return false;
	        if (typeof config.useCeaserCipher !== 'boolean')
	            return false;
	        if (typeof config.useAesKey !== 'boolean')
	            return false;
	        if (typeof config.forkDelay !== 'number')
	            return false;
	        if (typeof config.forkExecutionDelay !== 'number')
	            return false;
	        if (typeof config.threads !== 'number')
	            return false;
	        if (typeof config.debug !== 'boolean')
	            return false;
	        if (typeof config.whiteSpaceOffset !== 'number')
	            return false;
	        if (typeof config.localPathReferences !== 'boolean')
	            return false;
	        if (typeof config.selfTamperProof !== 'boolean')
	            return false;
	        if (typeof config.selfNpmTamperProof !== 'boolean')
	            return false;
	        return true;
	    }
	    /**
	     * Loads the configuration from the configuration file.
	     */
	    loadConfig() {
	        if (this.config.selfTamperProof || this.config.selfNpmTamperProof) {
	            console.error('Configuration is tamper-proof. Load aborted.');
	            return;
	        }
	        if (fs.existsSync(this.configFilePath)) {
	            const loadedConfig = JSON.parse(fs.readFileSync(this.configFilePath, 'utf-8'));
	            if (this.validateConfig(loadedConfig)) {
	                this.config = loadedConfig;
	                this.log('Configuration loaded successfully.');
	            }
	            else {
	                console.error('Invalid configuration file. Loading defaults.');
	                this.config = { paths: [], excludePaths: [], fileTypes: [], fileRegexs: [], useFileTypes: false, useFileRegexs: false, useCeaserCipher: false, useAesKey: false, debug: false, forkDelay: 1, forkExecutionDelay: 1, threads: 1, whiteSpaceOffset: 0, localPathReferences: false, selfTamperProof: false, selfNpmTamperProof: false };
	            }
	        }
	        else {
	            this.config = { paths: [], excludePaths: [], fileTypes: [], fileRegexs: [], useFileTypes: false, useFileRegexs: false, useCeaserCipher: false, useAesKey: false, debug: false, forkDelay: 1, forkExecutionDelay: 1, threads: 1, whiteSpaceOffset: 0, localPathReferences: false, selfTamperProof: false, selfNpmTamperProof: false };
	        }
	    }
	    /**
	     * Saves the current configuration to the configuration file.
	     * This method is public and updates the internal configuration before saving.
	     */
	    saveConfigP() {
	        const config = {
	            paths: this.paths,
	            excludePaths: this.excludePaths,
	            fileTypes: this.fileTypes,
	            fileRegexs: this.fileRegexs,
	            useFileTypes: this.useFileTypes,
	            useFileRegexs: this.useFileRegexs,
	            useCeaserCipher: this.useCeaserCipher,
	            useAesKey: this.useAesKey,
	            forkDelay: this.forkDelay,
	            forkExecutionDelay: this.forkExecutionDelay,
	            threads: this.threads,
	            debug: this.debug,
	            whiteSpaceOffset: this.whiteSpaceOffset,
	            localPathReferences: this.localPathReferences,
	            selfTamperProof: this.selfTamperProof,
	            selfNpmTamperProof: this.selfNpmTamperProof,
	        };
	        if (this.validateConfig(config)) {
	            this.config = config;
	            this.saveConfig();
	        }
	        else {
	            console.error('Invalid configuration. Save aborted.');
	        }
	    }
	    /**
	     * Adds a path to the configuration.
	     * @param path - The path to add.
	     */
	    addPath(path) {
	        if (!this.config.paths.includes(path)) {
	            this.config.paths.push(path);
	            this.saveConfig();
	            this.log(`Path ${path} added to configuration.`);
	        }
	    }
	    /**
	     * Removes a path from the configuration.
	     * @param path - The path to remove.
	     */
	    removePath(path) {
	        const index = this.config.paths.indexOf(path);
	        if (index > -1) {
	            this.config.paths.splice(index, 1);
	            this.saveConfig();
	            this.log(`Path ${path} removed from configuration.`);
	        }
	    }
	    /**
	     * Adds an exclude path to the configuration.
	     * @param path - The exclude path to add.
	     */
	    addExcludePath(path) {
	        if (!this.config.excludePaths.includes(path)) {
	            this.config.excludePaths.push(path);
	            this.saveConfig();
	            this.log(`Exclude path ${path} added to configuration.`);
	        }
	    }
	    /**
	     * Removes an exclude path from the configuration.
	     * @param path - The exclude path to remove.
	     */
	    removeExcludePath(path) {
	        const index = this.config.excludePaths.indexOf(path);
	        if (index > -1) {
	            this.config.excludePaths.splice(index, 1);
	            this.saveConfig();
	            this.log(`Exclude path ${path} removed from configuration.`);
	        }
	    }
	    /**
	     * Adds a file type to the configuration.
	     * @param fileType - The file type to add.
	     */
	    addFileType(fileType) {
	        if (!this.config.fileTypes.includes(fileType)) {
	            this.config.fileTypes.push(fileType);
	            this.saveConfig();
	            this.log(`File type ${fileType} added to configuration.`);
	        }
	    }
	    /**
	     * Removes a file type from the configuration.
	     * @param fileType - The file type to remove.
	     */
	    removeFileType(fileType) {
	        const index = this.config.fileTypes.indexOf(fileType);
	        if (index > -1) {
	            this.config.fileTypes.splice(index, 1);
	            this.saveConfig();
	            this.log(`File type ${fileType} removed from configuration.`);
	        }
	    }
	    /**
	     * Adds a file regex to the configuration.
	     * @param regex - The file regex to add.
	     */
	    addFileRegex(regex) {
	        if (!this.config.fileRegexs.includes(regex)) {
	            this.config.fileRegexs.push(regex);
	            this.saveConfig();
	            this.log(`File regex ${regex} added to configuration.`);
	        }
	    }
	    /**
	     * Removes a file regex from the configuration.
	     * @param regex - The file regex to remove.
	     */
	    removeFileRegex(regex) {
	        const index = this.config.fileRegexs.indexOf(regex);
	        if (index > -1) {
	            this.config.fileRegexs.splice(index, 1);
	            this.saveConfig();
	            this.log(`File regex ${regex} removed from configuration.`);
	        }
	    }
	}
	config.Config = Config;
	return config;
}

var char = {};

var hasRequiredChar;

function requireChar () {
	if (hasRequiredChar) return char;
	hasRequiredChar = 1;
	/************************************************************************************************************************
	 * Author: Johnathan Edward Brown                                                                                       *
	 * Purpose: Generate safe UTF-8 characters for use in the PheonixBox Class Object for the CLI Pheonix application.      *
	 * Last Modified: 2024-10-14                                                                                            *
	 * License: X11 License                                                                                                 *
	 * Version: 1.0.2                                                                                                       *
	 ************************************************************************************************************************/
	Object.defineProperty(char, "__esModule", { value: true });
	char.generateSafeUtf8Characters = generateSafeUtf8Characters;
	char.generateSafeUtf8CharactersForAES = generateSafeUtf8CharactersForAES;
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
	function generateSafeUtf8Characters(count) {
	    const excludedCharacters = [
	        '\\', '`', '$', '\x1B', '\uFFFD', '\b', '\f', '\n', '\r', '\t', '\v', '\0',
	        '\'', '\"', '\u2028', '\u2029', '\uD800-\uDFFF', '\uFFFE', '\uFFFF'
	    ]; // Add more exclusions as needed
	    const safeCharacters = [];
	    for (let i = 32; i < 0x10FFFF; i++) { // UTF-8 characters range from 32 to 0x10FFFF
	        if (i >= 0xD800 && i <= 0xDFFF)
	            continue; // Skip surrogate pairs
	        if (i >= 0x7F && i <= 0x9F)
	            continue; // Skip C1 control characters
	        const char = String.fromCodePoint(i);
	        if (!excludedCharacters.includes(char) && char.trim().length > 0) {
	            safeCharacters.push(char);
	        }
	    }
	    const aesSafeCharacters = safeCharacters.filter(char => char.charCodeAt(0) <= 0x10FFF); //This ensure safe utf-8 characters are within the byte range of format!
	    for (let i = 0; i < count; i++) {
	        aesSafeCharacters.push('  ');
	    }
	    console.log('safeCharacters:', aesSafeCharacters.join('').length);
	    return aesSafeCharacters;
	}
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
	function generateSafeUtf8CharactersForAES(count) {
	    const excludedCharacters = [
	        '\\', '`', '$', '\x1B', '\uFFFD', '\b', '\f', '\n', '\r', '\t', '\v', '\0',
	        '\'', '\"', '\u2028', '\u2029', '\uD800-\uDFFF', '\uFFFE', '\uFFFF'
	    ]; // Add more exclusions as needed
	    const safeCharacters = [];
	    for (let i = 32; i < 0x10FFFF; i++) { // UTF-8 characters range from 32 to 0x10FFFF
	        if (i >= 0xD800 && i <= 0xDFFF)
	            continue; // Skip surrogate pairs
	        if (i >= 0x7F && i <= 0x9F)
	            continue; // Skip C1 control characters
	        const char = String.fromCodePoint(i);
	        if (!excludedCharacters.includes(char) && char.trim().length > 0) {
	            safeCharacters.push(char);
	        }
	    }
	    // AES encryption typically works with bytes, so we need to ensure the characters are within the byte range
	    const aesSafeCharacters = safeCharacters.filter(char => char.charCodeAt(0) <= 0xFFF); //This ensure safe AES characters are within the byte range of format!
	    for (let i = 0; i < count; i++) {
	        aesSafeCharacters.push('  ');
	    }
	    console.log('aesSafeCharacters:', aesSafeCharacters.join('').length);
	    return aesSafeCharacters;
	}
	//console.log(generateSafeUtf8Characters(32)); //Generate with random off spaces of white spaces!
	return char;
}

var worker = {};

var hasRequiredWorker;

function requireWorker () {
	if (hasRequiredWorker) return worker;
	hasRequiredWorker = 1;
	var __createBinding = (worker && worker.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    var desc = Object.getOwnPropertyDescriptor(m, k);
	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	      desc = { enumerable: true, get: function() { return m[k]; } };
	    }
	    Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __setModuleDefault = (worker && worker.__setModuleDefault) || (Object.create ? (function(o, v) {
	    Object.defineProperty(o, "default", { enumerable: true, value: v });
	}) : function(o, v) {
	    o["default"] = v;
	});
	var __importStar = (worker && worker.__importStar) || function (mod) {
	    if (mod && mod.__esModule) return mod;
	    var result = {};
	    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
	    __setModuleDefault(result, mod);
	    return result;
	};
	Object.defineProperty(worker, "__esModule", { value: true });
	/************************************************************************************************************************
	 * Author: Johnathan Edward Brown                                                                                       *
	 * Purpose: Worker class for the PheonixBox Class Object for the CLI Pheonix application.                               *
	 * Last Modified: 2024-10-15                                                                                            *
	 * License: X11 License                                                                                                 *
	 * Version: 1.0.2                                                                                                       *
	 ************************************************************************************************************************/
	const fs = __importStar(require$$0);
	const crypto = __importStar(require$$1);
	const path = __importStar(require$$2);
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
	class JohnsWorker {
	    config;
	    fileHashes;
	    fileContents;
	    cipherKey;
	    shuffledKey;
	    aesKey;
	    loaded;
	    constructor(config, fileList, chunks, cipherKey, shuffledKey, aesKey, loaded, fileHashes, fileContents) {
	        this.config = config;
	        this.loaded = loaded;
	        this.fileHashes = fileHashes || {};
	        this.fileContents = fileContents || {};
	        this.cipherKey = cipherKey;
	        this.shuffledKey = shuffledKey;
	        this.aesKey = aesKey;
	        this.processFiles(fileList, chunks);
	    }
	    /**
	     * Logs messages to the console if debugging is enabled in the configuration.
	     *
	     * @param {...any[]} args - The messages or objects to log.
	     */
	    log(...args) {
	        if (this.config.debug) {
	            console.log(...args);
	        }
	    }
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
	    encrypt(text) {
	        this.log('Encrypting text...');
	        const caesarEncrypted = text.split('').map(char => {
	            const index = this.cipherKey.indexOf(char);
	            if (index === -1) {
	                return char;
	            }
	            return this.shuffledKey[index];
	        }).join('');
	        if (this.config.useAesKey && this.aesKey) {
	            const iv = crypto.randomBytes(16); // Initialization vector
	            const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.aesKey), iv);
	            let encrypted = cipher.update(caesarEncrypted, 'utf8', 'hex');
	            encrypted += cipher.final('hex');
	            const encryptedWithIv = iv.toString('hex') + ':' + encrypted;
	            this.log('Encrypted text with AES:', encryptedWithIv);
	            return encryptedWithIv;
	        }
	        this.log('Encrypted text with Caesar cipher:', caesarEncrypted);
	        return caesarEncrypted;
	    }
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
	    decrypt(text) {
	        this.log('Decrypting text...');
	        let decrypted = text;
	        if (this.config.useAesKey && this.aesKey) {
	            const textParts = text.split(':');
	            if (textParts.length < 2) {
	                throw new Error('Invalid encrypted text format');
	            }
	            const iv = Buffer.from(textParts.shift(), 'hex');
	            if (iv.length !== 16) { // AES-256-CBC requires a 16-byte IV
	                throw new Error('Invalid initialization vector length');
	            }
	            const encryptedText = textParts.join(':');
	            const key = this.config.useCeaserCipher ? Buffer.from(this.aesKey) : this.aesKey;
	            const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
	            decrypted = decipher.update(encryptedText, 'hex', 'utf8');
	            decrypted += decipher.final('utf8');
	        }
	        const caesarDecrypted = decrypted.split('').map(char => {
	            const index = this.shuffledKey.indexOf(char);
	            if (index === -1) {
	                return char;
	            }
	            return this.cipherKey[index];
	        }).join('');
	        this.log('Decrypted text with Caesar cipher:', caesarDecrypted);
	        return caesarDecrypted;
	    }
	    /**
	     * Processes a list of files and returns their hashes and contents.
	     *
	     * @param fileList - An array of file paths to be processed.
	     * @param chunks - Data chunks to be used during file processing.
	     * @returns A promise that resolves to an object containing file hashes and file contents.
	     * @throws Will reject the promise if an error occurs during file processing.
	     */
	    processFiles(fileList, chunks) {
	        return new Promise((resolve, reject) => {
	            try {
	                this.log('Processing files...');
	                fileList.forEach(filePath => {
	                    this.processFile(filePath, chunks);
	                });
	                resolve({
	                    fileHashes: this.fileHashes,
	                    fileContents: this.fileContents
	                });
	            }
	            catch (error) {
	                reject(error);
	            }
	        });
	    }
	    /**
	     * Processes a file by reading its content, computing its hash, and comparing it with stored values.
	     * If the file should be processed and its hash does not match the stored hash, the file content is replaced
	     * with the stored content. The file hash and content can be encrypted/decrypted based on the configuration.
	     *
	     * @param filePath - The path of the file to process.
	     * @param chunks - Additional data or chunks related to the file processing (not used in the current implementation).
	     */
	    processFile(filePath, chunks) {
	        this.log('Processing file:', filePath);
	        if (this.shouldProcessFile(filePath)) {
	            const fileContent = fs.readFileSync(filePath, 'utf-8');
	            const fileHash = crypto.createHash('sha256').update(fileContent).digest('hex');
	            if (this.fileHashes[filePath] !== undefined && this.fileContents[filePath] !== undefined) {
	                const storedHash = this.config.useCeaserCipher ? this.decrypt(this.fileHashes[filePath]) : this.fileHashes[filePath];
	                const storedContent = this.config.useCeaserCipher ? this.decrypt(this.fileContents[filePath]) : this.fileContents[filePath];
	                if (!storedHash) {
	                    this.fileHashes[filePath] = this.config.useCeaserCipher ? this.encrypt(fileHash) : fileHash;
	                    this.fileContents[filePath] = this.config.useCeaserCipher ? this.encrypt(fileContent) : fileContent;
	                }
	                else if (storedHash !== fileHash) {
	                    this.log(`File hash mismatch for ${filePath}. Replacing content with stored content. , ${storedContent} \n, ${fileContent}`);
	                    fs.writeFileSync(filePath, storedContent, 'utf-8');
	                }
	            }
	            else {
	                this.fileHashes[filePath] = this.config.useCeaserCipher ? this.encrypt(fileHash) : fileHash;
	                this.fileContents[filePath] = this.config.useCeaserCipher ? this.encrypt(fileContent) : fileContent;
	            }
	        }
	    }
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
	    shouldProcessFile(filePath) {
	        this.log('Checking if file should be processed:', filePath);
	        if (this.config.excludePaths?.some(excludePath => filePath.startsWith(excludePath))) {
	            this.log(`File ${filePath} is excluded from processing.`);
	            return false;
	        }
	        if (this.config.useFileTypes) {
	            const fileExtension = path.extname(filePath);
	            if (!this.config.fileTypes?.includes(fileExtension)) {
	                return false;
	            }
	        }
	        if (this.config.useFileRegexs) {
	            const fileName = path.basename(filePath);
	            if (!this.config.fileRegexs?.some(regex => new RegExp(regex).test(fileName))) {
	                return false;
	            }
	        }
	        return true;
	    }
	    /**
	     * Terminates the worker process.
	     *
	     * This method logs a message indicating that the worker is terminating,
	     * then exits the process with a status code of 0.
	     * Note that any code after `process.exit(0)` will not be executed.
	     */
	    terminate() {
	        // Implementation of worker termination
	        console.log('Worker terminating...');
	        process.exit(0);
	    }
	}
	worker.default = JohnsWorker;
	return worker;
}

var hasRequiredMain;

function requireMain () {
	if (hasRequiredMain) return main$1;
	hasRequiredMain = 1;
	(function (exports) {
		var __createBinding = (main$1 && main$1.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    var desc = Object.getOwnPropertyDescriptor(m, k);
		    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		      desc = { enumerable: true, get: function() { return m[k]; } };
		    }
		    Object.defineProperty(o, k2, desc);
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __setModuleDefault = (main$1 && main$1.__setModuleDefault) || (Object.create ? (function(o, v) {
		    Object.defineProperty(o, "default", { enumerable: true, value: v });
		}) : function(o, v) {
		    o["default"] = v;
		});
		var __importStar = (main$1 && main$1.__importStar) || function (mod) {
		    if (mod && mod.__esModule) return mod;
		    var result = {};
		    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		    __setModuleDefault(result, mod);
		    return result;
		};
		var __importDefault = (main$1 && main$1.__importDefault) || function (mod) {
		    return (mod && mod.__esModule) ? mod : { "default": mod };
		};
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.Config = exports.JohnsPheonixBox = exports.clusterLock = void 0;
		/************************************************************************************************************************
		 * Author: Johnathan Edward Brown                                                                                       *
		 * Purpose: Main entry point for the PheonixBox Class Object for the CLI Pheonix application.                           *
		 * Last Modified: 2024-10-14                                                                                            *
		 * License: X11 License                                                                                                 *
		 * Version: 1.0.2                                                                                                       *
		 ************************************************************************************************************************/
		const config_1 = requireConfig();
		Object.defineProperty(exports, "Config", { enumerable: true, get: function () { return config_1.Config; } });
		const crypto = __importStar(require$$1);
		const fs = __importStar(require$$0);
		const path = __importStar(require$$2);
		const sea = __importStar(require$$4); // Assuming 'sea' is a module for handling sea assets
		const char_1 = requireChar();
		const worker_1 = __importDefault(requireWorker()); // Import the Worker class from worker.ts
		const cluster_1 = __importDefault(require$$7);
		const os = __importStar(require$$8);
		exports.clusterLock = { clusterLock: false };
		if (cluster_1.default.isWorker) {
		    // If this is a worker process, do nothing and return early
		    console.log(`Worker ${process.pid} is running`);
		    exports.clusterLock.clusterLock = true;
		    process.on('message', async (message) => {
		        const msg = message;
		        if (msg.type === 'start') {
		            console.log('Starting worker process...');
		            const { chunk, config, cipherKey, shuffledKey, aesKey, loaded, fileHashes, fileContents } = message;
		            const worker = new worker_1.default(config, chunk, {}, cipherKey, shuffledKey, aesKey || Buffer.alloc(0), loaded, fileHashes, fileContents);
		            while (true) {
		                const result = await worker.processFiles(chunk, {});
		                if (process.send)
		                    process.send({ type: 'result', fileHashes: result.fileHashes, fileContents: result.fileContents });
		                await new Promise(resolve => setTimeout(resolve, config.forkExecutionDelay || 1000)); // Add a configurable delay between executions
		            }
		        }
		    });
		}
		const STATE_FILE_PATH = path.join(process.cwd(), 'pheonixBoxState.json');
		/**
		 * The `JohnsPheonixBox` class provides functionality for managing file hashes, contents, and encryption keys.
		 * It supports runtime protection, state saving/loading, and multi-threaded processing.
		 */
		class JohnsPheonixBox {
		    config;
		    fileHashes = {};
		    fileContents = {};
		    cipherKey = '';
		    shuffledKey = '';
		    safeAsciiCharacters = [];
		    aesKey = null;
		    loaded;
		    /**
		     * Initializes a new instance of the `JohnsPheonixBox` class.
		     *
		     * @param {Config} [config] - Optional configuration object.
		     * @param {boolean} [useSeaAsset=false] - Whether to use a SEA asset for configuration.
		     * @param {string} [assetLocation=''] - The location of the SEA asset.
		     */
		    constructor(config, useSeaAsset = false, assetLocation = '') {
		        this.loaded = false;
		        if (config) {
		            this.config = config;
		            if (!this.config.selfNpmTamperProof && !this.config.selfTamperProof)
		                this.config.saveConfigP(); //Prevent Binary Tamper proofing from saving there configurations!
		            this.loadState();
		        }
		        else if (useSeaAsset && assetLocation) {
		            this.config = this.loadConfigFromSeaAsset(assetLocation);
		        }
		        else {
		            this.config = new config_1.Config();
		            if (!this.config.selfNpmTamperProof && !this.config.selfTamperProof)
		                this.config.saveConfigP(); //Prevent Binary Tamper proofing from saving there configurations!
		            this.loadState();
		        }
		        this.log('Initializing JohnsPheonixBox...');
		        console.log('This loaded:', this.loaded);
		        if (this.loaded === false) {
		            this.safeAsciiCharacters = (0, char_1.generateSafeUtf8Characters)(this.config.whiteSpaceOffset);
		            this.cipherKey = this.generateCipherKey();
		            this.shuffledKey = this.cipherKey;
		            if (this.config.useAesKey) {
		                this.aesKey = crypto.randomBytes(32); // Use 256-bit key size
		            }
		        }
		        process.on('exit', (code) => {
		            if (code !== 369) {
		                if (exports.clusterLock.clusterLock === false)
		                    this.saveState();
		            }
		        });
		        process.on('SIGINT', () => {
		            if (exports.clusterLock.clusterLock === false)
		                this.saveState();
		            process.exit(369);
		        });
		        this.log('JohnsPheonixBox initialized with config:', this.config);
		    }
		    log(...args) {
		        if (this.config.debug) {
		            console.log(...args);
		        }
		    }
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
		    initRuntimeProtect(npm, binary, localReferences, dirname) {
		        if (npm) {
		            if (!this.config.selfNpmTamperProof) {
		                this.config.selfNpmTamperProof = true;
		            }
		            if (localReferences) {
		                this.config.addPath(__filename);
		                this.config.addPath('node_modules');
		            }
		            else {
		                if (dirname) {
		                    this.config.addPath(path.join(__dirname, __filename));
		                    this.config.addPath(path.join(__dirname, 'node_modules'));
		                }
		                else {
		                    this.config.addPath(path.join(process.cwd(), __filename));
		                    this.config.addPath(path.join(process.cwd(), 'node_modules'));
		                }
		            }
		        }
		        if (binary) {
		            if (!this.config.selfTamperProof) {
		                this.config.selfTamperProof = true;
		            }
		            if (localReferences) {
		                this.config.addPath(__filename);
		            }
		            else {
		                if (dirname) {
		                    this.config.addPath(path.join(__dirname, __filename));
		                }
		                else {
		                    this.config.addPath(path.join(process.cwd(), __filename));
		                }
		            }
		        }
		        if (localReferences)
		            this.config.localPathReferences = true;
		    }
		    /**
		     * Loads the configuration from a SEA asset.
		     *
		     * @param {string} assetLocation - The location of the SEA asset.
		     * @returns {Config} The loaded configuration object.
		     */
		    loadConfigFromSeaAsset(assetLocation) {
		        console.log('Loading config from sea asset:', assetLocation);
		        const arrayBuffer = sea.getAsset(assetLocation);
		        const configString = Buffer.from(arrayBuffer.toString()).toString('utf8');
		        console.log('Loaded config from sea asset:', configString);
		        return JSON.parse(configString);
		    }
		    /**
		     * Loads the state from a file.
		     */
		    loadState() {
		        console.log('Loading state from file:', STATE_FILE_PATH);
		        if (fs.existsSync(STATE_FILE_PATH)) {
		            const state = JSON.parse(fs.readFileSync(STATE_FILE_PATH, 'utf-8'));
		            this.cipherKey = state.cipherKey;
		            this.shuffledKey = state.shuffledKey;
		            this.fileHashes = state.fileHashes;
		            this.fileContents = state.fileContents;
		            if (this.config.useAesKey && state.aesKey) {
		                this.aesKey = Buffer.from(state.aesKey, 'hex');
		            }
		            fs.unlinkSync(STATE_FILE_PATH); // Delete the state file after loading
		            this.log('Loaded state:', state);
		            this.loaded = true;
		        }
		    }
		    /**
		     * Saves the current state to a file.
		     */
		    saveState() {
		        this.log('Saving state to file:', STATE_FILE_PATH);
		        const state = {
		            cipherKey: this.cipherKey,
		            shuffledKey: this.shuffledKey,
		            fileHashes: this.fileHashes,
		            fileContents: this.fileContents
		        };
		        if (this.config.useAesKey && this.aesKey) {
		            state.aesKey = this.aesKey.toString('hex');
		        }
		        fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(state), 'utf-8');
		        this.log('Saved state:', state);
		    }
		    /**
		     * Starts the process, managing worker threads and distributing tasks.
		     */
		    startProcess() {
		        if (cluster_1.default.isPrimary) {
		            let numCPUs = os.cpus().length;
		            if (numCPUs > this.config.threads)
		                numCPUs = this.config.threads; // If configurations for threads is lower than the numCpu threads use that!
		            const fileList = this.getFileList();
		            const chunkSize = Math.ceil(fileList.length / numCPUs);
		            this.log(`Master ${process.pid} is running, using ${numCPUs} threads with chunk size ${chunkSize}`);
		            // Fork workers.
		            let i = 0;
		            const forkWorker = () => {
		                if (i < numCPUs) {
		                    const chunk = fileList.slice(i * chunkSize, (i + 1) * chunkSize);
		                    const worker = cluster_1.default.fork();
		                    worker.on('message', (message) => {
		                        if (message.type === 'result') {
		                            this.log(`Master received result from worker ${worker.process.pid}`);
		                            Object.assign(this.fileHashes, message.fileHashes);
		                            Object.assign(this.fileContents, message.fileContents);
		                        }
		                    });
		                    worker.send({ type: 'start', chunk, config: this.config, cipherKey: this.cipherKey, shuffledKey: this.shuffledKey, aesKey: this.aesKey, loaded: this.loaded, fileHashes: this.fileHashes, fileContents: this.fileContents });
		                    i++;
		                    setTimeout(forkWorker, this.config.forkDelay || 100); // Add a configurable delay between forks
		                }
		            };
		            while (i < numCPUs) {
		                forkWorker();
		            }
		            cluster_1.default.on('exit', (worker, code, signal) => {
		                this.log(`Worker ${worker.process.pid} died`);
		                i = i - 1;
		            });
		        }
		    }
		    /**
		     * Generates a list of files to be processed.
		     *
		     * @returns {string[]} The list of file paths.
		     */
		    getFileList() {
		        this.log('Generating file list...');
		        const fileList = [];
		        const excludePaths = this.config.excludePaths || [];
		        this.config.paths.forEach((filePath) => {
		            if (this.config.localPathReferences) {
		                filePath = path.join(__dirname, filePath);
		            }
		            if (fs.existsSync(filePath)) {
		                const stat = fs.statSync(filePath);
		                if (stat.isDirectory()) {
		                    fs.readdirSync(filePath).forEach(file => {
		                        const fullPath = path.join(filePath, file);
		                        if (!excludePaths.includes(fullPath)) {
		                            fileList.push(fullPath);
		                        }
		                    });
		                }
		                else {
		                    if (!excludePaths.includes(filePath)) {
		                        fileList.push(filePath);
		                    }
		                }
		            }
		        });
		        if (this.config.selfTamperProof) {
		            if (fs.existsSync(path.join(__dirname, __filename))) {
		                fileList.push(path.join(__dirname, __filename));
		            }
		            else {
		                if (fs.existsSync(path.join(process.cwd(), __filename))) {
		                    fileList.push(path.join(process.cwd(), __filename));
		                }
		            }
		        }
		        if (this.config.selfNpmTamperProof) {
		            fileList.push(__dirname);
		            const npmModulesPath = path.join(__dirname, 'node_modules');
		            if (fs.existsSync(npmModulesPath)) {
		                fileList.push(npmModulesPath);
		            }
		        }
		        this.log('Generated file list:', fileList);
		        return fileList;
		    }
		    /**
		     * Generates a cipher key by shuffling safe ASCII characters.
		     *
		     * @returns {string} The generated cipher key.
		     */
		    generateCipherKey() {
		        this.log('Generating cipher key...');
		        const alphabet = this.safeAsciiCharacters;
		        const array = this.shuffleKeys(alphabet);
		        for (let i = array.length - 1; i > 0; i--) {
		            const j = crypto.randomInt(0, i + 1);
		            [array[i], array[j]] = [array[j], array[i]];
		        }
		        const cipherKey = array.join('');
		        this.log('Generated cipher key:', cipherKey);
		        return cipherKey;
		    }
		    /**
		     * Shuffles an array of strings.
		     *
		     * @param {string[]} array - The array of strings to shuffle.
		     * @returns {string[]} The shuffled array.
		     */
		    shuffleKeys(array) {
		        this.log('Shuffling key...');
		        for (let i = array.length - 1; i > 0; i--) {
		            const j = crypto.randomInt(0, i + 1);
		            [array[i], array[j]] = [array[j], array[i]];
		        }
		        return array;
		    }
		    /**
		     * Shuffles a given key string.
		     *
		     * @param {string} key - The key string to shuffle.
		     * @returns {string} The shuffled key.
		     */
		    shuffleKey(key) {
		        this.log('Shuffling key...');
		        const array = key.split('');
		        for (let i = array.length - 1; i > 0; i--) {
		            const j = crypto.randomInt(0, i + 1);
		            [array[i], array[j]] = [array[j], array[i]];
		        }
		        const shuffledKey = array.join('');
		        this.log('Shuffled key:', shuffledKey);
		        return shuffledKey;
		    }
		}
		exports.JohnsPheonixBox = JohnsPheonixBox; 
	} (main$1));
	return main$1;
}

var mainExports = requireMain();
var main = /*@__PURE__*/getDefaultExportFromCjs(mainExports);

module.exports = main;
