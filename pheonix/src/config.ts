import * as fs from 'fs';

export class Config {
    private configFilePath = 'configurable.json';
    private config: {
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
        localPathReferences: boolean; // Added here
    };
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
    localPathReferences: boolean; // Added here

    constructor(configObject?: any) {
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
        } else {
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

    private log(message: string) {
        if (this.debug) {
            console.log(message);
        }
    }

    private saveConfig() {
        if (this.validateConfig(this.config)) {
            fs.writeFileSync(this.configFilePath, JSON.stringify(this.config, null, 2));
            this.log('Configuration saved successfully.');
        } else {
            console.error('Invalid configuration. Save aborted.');
        }
    }

    private validateConfig(config: any): boolean {
        if (!Array.isArray(config.paths)) return false;
        if (!Array.isArray(config.excludePaths)) return false;
        if (!Array.isArray(config.fileTypes)) return false;
        if (!Array.isArray(config.fileRegexs)) return false;
        if (typeof config.useFileTypes !== 'boolean') return false;
        if (typeof config.useFileRegexs !== 'boolean') return false;
        if (typeof config.useCeaserCipher !== 'boolean') return false;
        if (typeof config.useAesKey !== 'boolean') return false;
        if (typeof config.forkDelay !== 'number') return false;
        if (typeof config.forkExecutionDelay !== 'number') return false;
        if (typeof config.threads !== 'number') return false;
        if (typeof config.debug !== 'boolean') return false;
        if (typeof config.whiteSpaceOffset !== 'number') return false;
        if (typeof config.localPathReferences !== 'boolean') return false; // Added here
        return true;
    }

    private loadConfig() {
        if (fs.existsSync(this.configFilePath)) {
            const loadedConfig = JSON.parse(fs.readFileSync(this.configFilePath, 'utf-8'));
            if (this.validateConfig(loadedConfig)) {
                this.config = loadedConfig;
                this.log('Configuration loaded successfully.');
            } else {
                console.error('Invalid configuration file. Loading defaults.');
                this.config = { paths: [], excludePaths: [], fileTypes: [], fileRegexs: [], useFileTypes: false, useFileRegexs: false, useCeaserCipher: false, useAesKey: false, debug: false, forkDelay: 1, forkExecutionDelay: 1, threads: 1, whiteSpaceOffset: 0, localPathReferences: false };
            }
        } else {
            this.config = { paths: [], excludePaths: [], fileTypes: [], fileRegexs: [], useFileTypes: false, useFileRegexs: false, useCeaserCipher: false, useAesKey: false, debug: false, forkDelay: 1, forkExecutionDelay: 1, threads: 1, whiteSpaceOffset: 0, localPathReferences: false };
        }
    }

    public saveConfigP() {
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
        }
        if (this.validateConfig(config)) {
            this.config = config;
            this.saveConfig();
        } else {
            console.error('Invalid configuration. Save aborted.');
        }
    }

    addPath(path: string) {
        if (!this.config.paths.includes(path)) {
            this.config.paths.push(path);
            this.saveConfig();
            this.log(`Path ${path} added to configuration.`);
        }
    }

    removePath(path: string) {
        const index = this.config.paths.indexOf(path);
        if (index > -1) {
            this.config.paths.splice(index, 1);
            this.saveConfig();
            this.log(`Path ${path} removed from configuration.`);
        }
    }

    addExcludePath(path: string) {
        if (!this.config.excludePaths.includes(path)) {
            this.config.excludePaths.push(path);
            this.saveConfig();
            this.log(`Exclude path ${path} added to configuration.`);
        }
    }

    removeExcludePath(path: string) {
        const index = this.config.excludePaths.indexOf(path);
        if (index > -1) {
            this.config.excludePaths.splice(index, 1);
            this.saveConfig();
            this.log(`Exclude path ${path} removed from configuration.`);
        }
    }

    addFileType(fileType: string) {
        if (!this.config.fileTypes.includes(fileType)) {
            this.config.fileTypes.push(fileType);
            this.saveConfig();
            this.log(`File type ${fileType} added to configuration.`);
        }
    }

    removeFileType(fileType: string) {
        const index = this.config.fileTypes.indexOf(fileType);
        if (index > -1) {
            this.config.fileTypes.splice(index, 1);
            this.saveConfig();
            this.log(`File type ${fileType} removed from configuration.`);
        }
    }

    addFileRegex(regex: string) {
        if (!this.config.fileRegexs.includes(regex)) {
            this.config.fileRegexs.push(regex);
            this.saveConfig();
            this.log(`File regex ${regex} added to configuration.`);
        }
    }

    removeFileRegex(regex: string) {
        const index = this.config.fileRegexs.indexOf(regex);
        if (index > -1) {
            this.config.fileRegexs.splice(index, 1);
            this.saveConfig();
            this.log(`File regex ${regex} removed from configuration.`);
        }
    }

    // Add similar methods for threads
}
