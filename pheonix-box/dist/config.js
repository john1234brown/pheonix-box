"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
/************************************************************************************************************************
 * Author: Johnathan Edward Brown                                                                                       *
 * Purpose: Configuration class for the CLI Pheonix application.                                                        *
 * Last Modified: 2024-10-14                                                                                            *
 * License: X11 License                                                                                                 *
 * Version: 1.0.0                                                                                                       *
 ************************************************************************************************************************/
const fs = __importStar(require("fs"));
class Config {
    configFilePath = 'configurable.json';
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
    selfNpmTamperProof; // Added here
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
            selfNpmTamperProof: false, // Added here
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
        this.selfNpmTamperProof = this.config.selfNpmTamperProof; // Added here
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
            return false;
        if (typeof config.selfTamperProof !== 'boolean')
            return false;
        if (typeof config.selfNpmTamperProof !== 'boolean')
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
                this.config = { paths: [], excludePaths: [], fileTypes: [], fileRegexs: [], useFileTypes: false, useFileRegexs: false, useCeaserCipher: false, useAesKey: false, debug: false, forkDelay: 1, forkExecutionDelay: 1, threads: 1, whiteSpaceOffset: 0, localPathReferences: false, selfTamperProof: false, selfNpmTamperProof: false };
            }
        }
        else {
            this.config = { paths: [], excludePaths: [], fileTypes: [], fileRegexs: [], useFileTypes: false, useFileRegexs: false, useCeaserCipher: false, useAesKey: false, debug: false, forkDelay: 1, forkExecutionDelay: 1, threads: 1, whiteSpaceOffset: 0, localPathReferences: false, selfTamperProof: false, selfNpmTamperProof: false };
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
            localPathReferences: this.localPathReferences,
            selfTamperProof: this.selfTamperProof,
            selfNpmTamperProof: this.selfNpmTamperProof, // Added here
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
