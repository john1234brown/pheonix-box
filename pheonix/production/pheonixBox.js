/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/char.ts":
/*!*********************!*\
  !*** ./src/char.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateSafeUtf8Characters = generateSafeUtf8Characters;
exports.generateSafeUtf8CharactersForAES = generateSafeUtf8CharactersForAES;
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
    for (let i = 0; i < count; i++) {
        safeCharacters.push('  ');
    }
    //    console.log('safeCharacters:', safeCharacters.join(''));
    console.log('safeCharacters:', safeCharacters.join('').length);
    return safeCharacters;
}
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
    const aesSafeCharacters = safeCharacters.filter(char => char.charCodeAt(0) <= 0xFF);
    for (let i = 0; i < count; i++) {
        //        aesSafeCharacters.push(' ');
    }
    //    console.log('aesSafeCharacters:', aesSafeCharacters.join(''));
    console.log('aesSafeCharacters:', aesSafeCharacters.join('').length);
    return aesSafeCharacters;
}
//console.log(generateSafeUtf8Characters(32)); //Generate with random off spaces of white spaces!


/***/ }),

/***/ "./src/cli.ts":
/*!********************!*\
  !*** ./src/cli.ts ***!
  \********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.clusterLock = void 0;
// Author: Johnathan Edward Brown
// Purpose: Main entry point for the CLI Pheonix application.
// Last Modified: 2024-10-13
const config_1 = __webpack_require__(/*! ./config */ "./src/config.ts");
const main_1 = __webpack_require__(/*! ./main */ "./src/main.ts");
const cluster_1 = __importDefault(__webpack_require__(/*! cluster */ "cluster"));
const worker_1 = __importDefault(__webpack_require__(/*! ./worker */ "./src/worker.ts"));
exports.clusterLock = { clusterLock: false };
if (cluster_1.default.isWorker) {
    // If this is a worker process, do nothing and return early
    console.log(`Worker ${process.pid} is running`);
    exports.clusterLock.clusterLock = true;
    process.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
        const msg = message;
        if (msg.type === 'start') {
            console.log('Starting worker process...');
            const { chunk, config, cipherKey, shuffledKey, aesKey, loaded, fileHashes, fileContents } = message;
            const worker = new worker_1.default(config, chunk, {}, cipherKey, shuffledKey, aesKey || Buffer.alloc(0), loaded, fileHashes, fileContents);
            while (true) {
                const result = yield worker.processFiles(chunk, {});
                if (process.send)
                    process.send({ type: 'result', fileHashes: result.fileHashes, fileContents: result.fileContents });
                yield new Promise(resolve => setTimeout(resolve, config.forkExecutionDelay || 1000)); // Add a configurable delay between executions
            }
        }
    }));
}
const args = process.argv.slice(2);
if (args.length < 1 || args[0] === 'help') {
    displayHelp();
    process.exit(1);
}
const command = args[0];
const action = args[1];
switch (command) {
    case 'config':
        handleConfig(action, args.slice(2));
        break;
    case 'start':
        if (exports.clusterLock.clusterLock === false) {
            const johnsPheonixBox = new main_1.JohnsPheonixBox();
            johnsPheonixBox.startProcess(); //Prevent dual executions from cluster modules!
        }
        break;
    default:
        console.error('Unknown command');
        displayHelp();
        process.exit(1);
}
function handleConfig(action, options) {
    const config = new config_1.Config();
    switch (action) {
        case 'addPath':
            config.addPath(options[0]);
            break;
        case 'removePath':
            config.removePath(options[0]);
            break;
        case 'addFileType':
            config.addFileType(options[0]);
            break;
        case 'removeFileType':
            config.removeFileType(options[0]);
            break;
        case 'addFileRegex':
            config.addFileRegex(options[0]);
            break;
        case 'removeFileRegex':
            config.removeFileRegex(options[0]);
            break;
        case 'setUseFileTypes':
            config.useFileTypes = options[0] === 'true';
            config.saveConfigP();
            console.log(`useFileTypes set to ${options[0]}`);
            break;
        case 'setUseFileRegexs':
            config.useFileRegexs = options[0] === 'true';
            config.saveConfigP();
            console.log(`useFileRegexs set to ${options[0]}`);
            break;
        case 'setUseCeaserCipher':
            config.useCeaserCipher = options[0] === 'true';
            config.saveConfigP();
            console.log(`useCeaserCipher set to ${options[0]}`);
            break;
        case 'setUseAesKey':
            config.useAesKey = options[0] === 'true';
            config.saveConfigP();
            console.log(`useAesKey set to ${options[0]}`);
            break;
        case 'setThreads':
            config.threads = parseInt(options[0], 10);
            config.saveConfigP();
            console.log(`threads set to ${options[0]}`);
            break;
        case 'setDebug':
            config.debug = options[0] === 'true';
            config.saveConfigP();
            console.log(`debug set to ${options[0]}`);
            break;
        case 'setWhiteSpaceOffset':
            config.whiteSpaceOffset = parseInt(options[0], 10);
            config.saveConfigP();
            console.log(`whiteSpaceOffset set to ${options[0]}`);
            break;
        case 'addExcludePath':
            config.addExcludePath(options[0]);
            break;
        case 'removeExcludePath':
            config.removeExcludePath(options[0]);
            break;
        case 'setForkDelay':
            config.forkDelay = parseInt(options[0], 10);
            config.saveConfigP();
            console.log(`forkDelay set to ${options[0]}`);
            break;
        case 'setForkExecutionDelay':
            config.forkExecutionDelay = parseInt(options[0], 10);
            config.saveConfigP();
            console.log(`forkExecutionDelay set to ${options[0]}`);
            break;
        case 'setLocalPathReferences':
            config.localPathReferences = options[0] === 'true';
            config.saveConfigP();
            console.log(`localPathReferences set to ${options[0]}`);
            break;
        default:
            console.error('Unknown config action');
            displayHelp();
            process.exit(1);
    }
    process.exit(0);
}
function displayHelp() {
    console.log('Usage: ./pheonixBox <command> <action> [options]');
    console.log('Commands:');
    console.log('  start                      Start the Pheonix process');
    console.log('  config <action> [options]  Configure the Pheonix settings');
    console.log('  help                       Display this help message');
    console.log('Config Actions:');
    console.log('  addPath <path>             Add a path to the configuration');
    console.log('  removePath <path>          Remove a path from the configuration');
    console.log('  addExcludePath <path>      Add a path to the exclude paths');
    console.log('  removeExcludePath <path>   Remove a path from the exclude paths');
    console.log('  addFileType <type>         Add a file type to the configuration');
    console.log('  removeFileType <type>      Remove a file type from the configuration');
    console.log('  addFileRegex <regex>       Add a file regex to the configuration');
    console.log('  removeFileRegex <regex>    Remove a file regex from the configuration');
    console.log('  setUseFileTypes <true|false> Set whether to use file types');
    console.log('  setUseFileRegexs <true|false> Set whether to use file regexs');
    console.log('  setUseCeaserCipher <true|false> Set whether to use Ceaser Cipher');
    console.log('  setUseAesKey <true|false>  Set whether to use AES Key');
    console.log('  setThreads <number>        Set the number of threads');
    console.log('  setWhiteSpaceOffset <number> Set the white space offset');
    console.log('  setForkDelay <number>      Set the fork delay');
    console.log('  setForkExecutionDelay <number> Set the fork execution delay');
    console.log('  setDebug <true|false>      Set the debug mode');
    console.log('  setLocalPathReferences <true|false> Set whether to use local path references');
}


/***/ }),

/***/ "./src/config.ts":
/*!***********************!*\
  !*** ./src/config.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Config = void 0;
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
class Config {
    constructor(configObject) {
        this.configFilePath = 'configurable.json';
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
            localPathReferences: false, // Added here
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
        this.localPathReferences = this.config.localPathReferences; // Added here
    }
    log(message) {
        if (this.debug) {
            console.log(message);
        }
    }
    saveConfig() {
        if (this.validateConfig(this.config)) {
            fs.writeFileSync(this.configFilePath, JSON.stringify(this.config, null, 2));
            this.log('Configuration saved successfully.');
        }
        else {
            console.error('Invalid configuration. Save aborted.');
        }
    }
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
            return false; // Added here
        return true;
    }
    loadConfig() {
        if (fs.existsSync(this.configFilePath)) {
            const loadedConfig = JSON.parse(fs.readFileSync(this.configFilePath, 'utf-8'));
            if (this.validateConfig(loadedConfig)) {
                this.config = loadedConfig;
                this.log('Configuration loaded successfully.');
            }
            else {
                console.error('Invalid configuration file. Loading defaults.');
                this.config = { paths: [], excludePaths: [], fileTypes: [], fileRegexs: [], useFileTypes: false, useFileRegexs: false, useCeaserCipher: false, useAesKey: false, debug: false, forkDelay: 1, forkExecutionDelay: 1, threads: 1, whiteSpaceOffset: 0, localPathReferences: false };
            }
        }
        else {
            this.config = { paths: [], excludePaths: [], fileTypes: [], fileRegexs: [], useFileTypes: false, useFileRegexs: false, useCeaserCipher: false, useAesKey: false, debug: false, forkDelay: 1, forkExecutionDelay: 1, threads: 1, whiteSpaceOffset: 0, localPathReferences: false };
        }
    }
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
            localPathReferences: this.localPathReferences, // Added here
        };
        if (this.validateConfig(config)) {
            this.config = config;
            this.saveConfig();
        }
        else {
            console.error('Invalid configuration. Save aborted.');
        }
    }
    addPath(path) {
        if (!this.config.paths.includes(path)) {
            this.config.paths.push(path);
            this.saveConfig();
            this.log(`Path ${path} added to configuration.`);
        }
    }
    removePath(path) {
        const index = this.config.paths.indexOf(path);
        if (index > -1) {
            this.config.paths.splice(index, 1);
            this.saveConfig();
            this.log(`Path ${path} removed from configuration.`);
        }
    }
    addExcludePath(path) {
        if (!this.config.excludePaths.includes(path)) {
            this.config.excludePaths.push(path);
            this.saveConfig();
            this.log(`Exclude path ${path} added to configuration.`);
        }
    }
    removeExcludePath(path) {
        const index = this.config.excludePaths.indexOf(path);
        if (index > -1) {
            this.config.excludePaths.splice(index, 1);
            this.saveConfig();
            this.log(`Exclude path ${path} removed from configuration.`);
        }
    }
    addFileType(fileType) {
        if (!this.config.fileTypes.includes(fileType)) {
            this.config.fileTypes.push(fileType);
            this.saveConfig();
            this.log(`File type ${fileType} added to configuration.`);
        }
    }
    removeFileType(fileType) {
        const index = this.config.fileTypes.indexOf(fileType);
        if (index > -1) {
            this.config.fileTypes.splice(index, 1);
            this.saveConfig();
            this.log(`File type ${fileType} removed from configuration.`);
        }
    }
    addFileRegex(regex) {
        if (!this.config.fileRegexs.includes(regex)) {
            this.config.fileRegexs.push(regex);
            this.saveConfig();
            this.log(`File regex ${regex} added to configuration.`);
        }
    }
    removeFileRegex(regex) {
        const index = this.config.fileRegexs.indexOf(regex);
        if (index > -1) {
            this.config.fileRegexs.splice(index, 1);
            this.saveConfig();
            this.log(`File regex ${regex} removed from configuration.`);
        }
    }
}
exports.Config = Config;


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JohnsPheonixBox = void 0;
const config_1 = __webpack_require__(/*! ./config */ "./src/config.ts");
const crypto = __importStar(__webpack_require__(/*! crypto */ "crypto"));
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const path = __importStar(__webpack_require__(/*! path */ "path"));
const sea = __importStar(__webpack_require__(/*! node:sea */ "node:sea")); // Assuming 'sea' is a module for handling sea assets
const char_1 = __webpack_require__(/*! ./char */ "./src/char.ts");
const cluster_1 = __importDefault(__webpack_require__(/*! cluster */ "cluster"));
const os = __importStar(__webpack_require__(/*! os */ "os"));
const cli_1 = __webpack_require__(/*! ./cli */ "./src/cli.ts");
const STATE_FILE_PATH = path.join(process.cwd(), 'pheonixBoxState.json');
class JohnsPheonixBox {
    constructor(useSeaAsset = false, assetLocation = '') {
        this.fileHashes = {};
        this.fileContents = {};
        this.cipherKey = '';
        this.shuffledKey = '';
        this.safeAsciiCharacters = [];
        this.aesKey = null;
        this.loaded = false;
        if (useSeaAsset && assetLocation) {
            this.config = this.loadConfigFromSeaAsset(assetLocation);
        }
        else {
            this.config = new config_1.Config();
            this.config.saveConfigP();
            this.loadState();
        }
        this.log('Initializing JohnsPheonixBox...');
        console.log('This loaded:', this.loaded);
        if (this.loaded === false) {
            this.safeAsciiCharacters = (0, char_1.generateSafeUtf8Characters)(this.config.whiteSpaceOffset);
            //            if (this.config.useAesKey)this.safeAsciiCharacters = generateSafeUtf8CharactersForAES(this.config.whiteSpaceOffset);
            this.cipherKey = this.generateCipherKey();
            this.shuffledKey = this.cipherKey;
            if (this.config.useAesKey) {
                this.aesKey = crypto.randomBytes(32); // Use 256-bit key size
            }
        }
        process.on('exit', (code) => {
            if (code !== 369) {
                if (cli_1.clusterLock.clusterLock === false)
                    this.saveState();
            }
        });
        process.on('SIGINT', () => {
            if (cli_1.clusterLock.clusterLock === false)
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
    loadConfigFromSeaAsset(assetLocation) {
        console.log('Loading config from sea asset:', assetLocation);
        const arrayBuffer = sea.getAsset(assetLocation);
        const configString = Buffer.from(arrayBuffer.toString()).toString('utf8');
        console.log('Loaded config from sea asset:', configString);
        return JSON.parse(configString);
    }
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
        this.log('Generated file list:', fileList);
        return fileList;
    }
    generateCipherKey() {
        this.log('Generating cipher key...');
        const alphabet = this.safeAsciiCharacters;
        const array = this.shuffleKeys(alphabet);
        for (let i = array.length - 1; i > 0; i--) {
            const j = crypto.randomInt(0, i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
        const cipherKey = array.join('');
        //        this.log('Generated cipher key:', cipherKey);
        return cipherKey;
    }
    shuffleKeys(array) {
        this.log('Shuffling key...');
        for (let i = array.length - 1; i > 0; i--) {
            const j = crypto.randomInt(0, i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    shuffleKey(key) {
        this.log('Shuffling key...');
        const array = key.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = crypto.randomInt(0, i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
        const shuffledKey = array.join('');
        //        this.log('Shuffled key:', shuffledKey);
        return shuffledKey;
    }
}
exports.JohnsPheonixBox = JohnsPheonixBox;
//const johnsPheonixBox = new JohnsPheonixBox();
//johnsPheonixBox.startProcess();


/***/ }),

/***/ "./src/worker.ts":
/*!***********************!*\
  !*** ./src/worker.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const crypto = __importStar(__webpack_require__(/*! crypto */ "crypto"));
const path = __importStar(__webpack_require__(/*! path */ "path"));
class JohnsWorker {
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
    log(...args) {
        if (this.config.debug) {
            console.log(...args);
        }
    }
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
            const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.aesKey), iv);
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
    shouldProcessFile(filePath) {
        var _a, _b, _c;
        this.log('Checking if file should be processed:', filePath);
        if ((_a = this.config.excludePaths) === null || _a === void 0 ? void 0 : _a.some(excludePath => filePath.startsWith(excludePath))) {
            this.log(`File ${filePath} is excluded from processing.`);
            return false;
        }
        if (this.config.useFileTypes) {
            const fileExtension = path.extname(filePath);
            if (!((_b = this.config.fileTypes) === null || _b === void 0 ? void 0 : _b.includes(fileExtension))) {
                return false;
            }
        }
        if (this.config.useFileRegexs) {
            const fileName = path.basename(filePath);
            if (!((_c = this.config.fileRegexs) === null || _c === void 0 ? void 0 : _c.some(regex => new RegExp(regex).test(fileName)))) {
                return false;
            }
        }
        return true;
    }
    terminate() {
        // Implementation of worker termination
        console.log('Worker terminating...');
        process.exit(0);
        console.log('Worker terminated');
    }
}
exports["default"] = JohnsWorker;


/***/ }),

/***/ "cluster":
/*!**************************!*\
  !*** external "cluster" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("cluster");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "node:sea":
/*!***************************!*\
  !*** external "node:sea" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("node:sea");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/cli.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=pheonixBox.js.map