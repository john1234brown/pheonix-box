// MAIN.TS
import { Config } from './config';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as sea from 'node:sea'; // Assuming 'sea' is a module for handling sea assets

const STATE_FILE_PATH = path.join(process.cwd(), 'pheonixBoxState.json');

export class JohnsPheonixBox {
    private config: Config;
    private fileHashes: { [key: string]: string } = {};
    private fileContents: { [key: string]: string } = {};
    private cipherKey: string = '';
    private shuffledKey: string = '';
    private aesKey: Buffer | null = null;

    constructor(useSeaAsset: boolean = false, assetLocation: string = '') {
        if (useSeaAsset && assetLocation) {
            this.config = this.loadConfigFromSeaAsset(assetLocation);
        } else {
            this.config = new Config();
            this.loadState();
        }
        this.log('Initializing JohnsPheonixBox...');
        this.cipherKey = this.cipherKey || this.generateCipherKey();
        this.shuffledKey = this.shuffledKey || this.shuffleKey(this.cipherKey);
        if (this.config.useAesKey) {
            this.aesKey = crypto.randomBytes(32); // Use 256-bit key size
        }

        process.on('exit', () => {
            this.saveState();
        });
        
        process.on('SIGINT', () => {
            this.saveState();
            process.exit();
        });

        this.log('JohnsPheonixBox initialized with config:', this.config);
    }

    private log(...args: any[]) {
        if (this.config.debug) {
            console.log(...args);
        }
    }

    private loadConfigFromSeaAsset(assetLocation: string): Config {
        console.log('Loading config from sea asset:', assetLocation);
        const arrayBuffer = sea.getAsset(assetLocation);
        const configString = Buffer.from(arrayBuffer.toString()).toString('utf8');
        console.log('Loaded config from sea asset:', configString);
        return JSON.parse(configString);
    }

    private loadState() {
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
        }
    }

    private saveState() {
        this.log('Saving state to file:', STATE_FILE_PATH);
        const state: any = {
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

    public startProcess() {
        this.log('Starting process...');
        const fileList = this.getFileList();
        const chunkSize = Math.ceil(fileList.length / this.config.threads);

        for (let i = 0; i < this.config.threads; i++) {
            const chunk = fileList.slice(i * chunkSize, (i + 1) * chunkSize);
            setInterval(() => {
                this.processChunk(chunk);
            }, this.config.interval * 1000);
        }

        this.log('Started process with file list:', fileList);
    }

    private getFileList(): string[] {
        this.log('Generating file list...');
        const fileList: string[] = [];
        this.config.paths.forEach((filePath: string) => {
            if (fs.existsSync(filePath)) {
                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) {
                    fs.readdirSync(filePath).forEach(file => {
                        const fullPath = path.join(filePath, file);
                        fileList.push(fullPath);
                    });
                } else {
                    fileList.push(filePath);
                }
            }
        });

        this.log('Generated file list:', fileList);
        return fileList;
    }

    private processChunk(chunk: string[]) {
        this.log('Processing chunk:', chunk);
        chunk.forEach(filePath => this.processFile(filePath));
    }

    private processFile(filePath: string) {
        this.log('Processing file:', filePath);
        if (this.shouldProcessFile(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const fileHash = crypto.createHash('sha256').update(fileContent).digest('hex');

            const storedHash = this.config.useCeaserCipher ? this.decrypt(this.fileHashes[filePath]) : this.fileHashes[filePath];
            const storedContent = this.config.useCeaserCipher ? this.decrypt(this.fileContents[filePath]) : this.fileContents[filePath];

            if (!storedHash) {
                this.fileHashes[filePath] = this.config.useCeaserCipher ? this.encrypt(fileHash) : fileHash;
                this.fileContents[filePath] = this.config.useCeaserCipher ? this.encrypt(fileContent) : fileContent;
                this.log(`Processed new file: ${filePath}`);
            } else if (storedHash !== fileHash) {
                fs.writeFileSync(filePath, storedContent);
                console.log(`File ${filePath} has been restored to its original content.`);
                this.log(`Restored file: ${filePath}`);
            }
        }
    }

    private shouldProcessFile(filePath: string): boolean {
        this.log('Checking if file should be processed:', filePath);
        if (this.config.useFileTypes) {
            const fileExtension = path.extname(filePath);
            if (!this.config.fileTypes.includes(fileExtension)) {
                this.log('File type not supported:', fileExtension);
                return false;
            }
        }

        if (this.config.useFileRegexs) {
            const fileName = path.basename(filePath);
            if (!this.config.fileRegexs.some(regex => new RegExp(regex).test(fileName))) {
                this.log('File name does not match regex:', fileName);
                return false;
            }
        }

        return true;
    }

    private generateCipherKey(): string {
        this.log('Generating cipher key...');
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const array = alphabet.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = crypto.randomInt(0, i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
        const cipherKey = array.join('');
        this.log('Generated cipher key:', cipherKey);
        return cipherKey;
    }

    private shuffleKey(key: string): string {
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

    private encrypt(text: string): string {
        this.log('Encrypting text...');
        const caesarEncrypted = text.split('').map(char => {
            const index = this.cipherKey.indexOf(char);
            return index !== -1 ? this.shuffledKey[(index + 3) % this.shuffledKey.length] : char;
        }).join('');

        if (this.config.useAesKey && this.aesKey) {
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv('aes-256-cbc', this.aesKey, iv);
            let encrypted = cipher.update(caesarEncrypted, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            const encryptedText = iv.toString('hex') + encrypted;
            this.log('Encrypted text with AES:', encryptedText);
            return encryptedText;
        }

        this.log('Encrypted text with Caesar cipher:', caesarEncrypted);
        return caesarEncrypted;
    }

    private decrypt(text: string): string {
        this.log('Decrypting text...');
        let decrypted = text;

        if (this.config.useAesKey && this.aesKey) {
            const iv = Buffer.from(text.slice(0, 32), 'hex');
            const encryptedText = text.slice(32);
            const decipher = crypto.createDecipheriv('aes-256-cbc', this.aesKey, iv);
            decrypted = decipher.update(encryptedText, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            this.log('Decrypted text with AES:', decrypted);
        }

        const caesarDecrypted = decrypted.split('').map(char => {
            const index = this.shuffledKey.indexOf(char);
            return index !== -1 ? this.cipherKey[(index - 3 + this.cipherKey.length) % this.cipherKey.length] : char;
        }).join('');

        this.log('Decrypted text with Caesar cipher:', caesarDecrypted);
        return caesarDecrypted;
    }
}

const johnsPheonixBox = new JohnsPheonixBox();
johnsPheonixBox.startProcess();
