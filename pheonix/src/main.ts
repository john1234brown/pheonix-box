// MAIN.TS
import { Config } from './config';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as sea from 'node:sea'; // Assuming 'sea' is a module for handling sea assets
import * as workerpool from 'workerpool';

const STATE_FILE_PATH = path.join(process.cwd(), 'pheonixBoxState.json');
const WORKER_PATH = path.join(__dirname, 'worker.js');

export class JohnsPheonixBox {
    private config: Config;
    private fileHashes: { [key: string]: string } = {};
    private fileContents: { [key: string]: string } = {};
    private cipherKey: string = '';
    private shuffledKey: string = '';
    private aesKey: Buffer | null = null;
    private pool: workerpool.Pool;
    private loaded: boolean;

    constructor(useSeaAsset: boolean = false, assetLocation: string = '') {
        this.loaded = false;
        if (useSeaAsset && assetLocation) {
            this.config = this.loadConfigFromSeaAsset(assetLocation);
        } else {
            this.config = new Config();
            this.loadState();
            this.loaded = true;
        }
        this.log('Initializing JohnsPheonixBox...');
        console.log('This loaded:', this.loaded);
        if (this.loaded === false) {
            this.cipherKey = this.cipherKey || this.generateCipherKey();
            this.shuffledKey = this.shuffledKey || this.shuffleKey(this.cipherKey);
            if (this.config.useAesKey) {
                this.aesKey = crypto.randomBytes(32); // Use 256-bit key size
            }
        }

        this.pool = workerpool.pool(WORKER_PATH);

        process.on('exit', (code) => {
            if (code !== 369){
                this.saveState();
                this.pool.terminate();
            }
        });
        
        process.on('SIGINT', () => {
            this.saveState();
            this.pool.terminate();
            process.exit(369);
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
            this.loaded = true;
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

        const promises = [];

        for (let i = 0; i < this.config.threads; i++) {
            const chunk = fileList.slice(i * chunkSize, (i + 1) * chunkSize);
            const chunkFileHashes: { [key: string]: string } = {};
            const chunkFileContents: { [key: string]: string } = {};

            // Populate chunkFileHashes and chunkFileContents with relevant data
            chunk.forEach(filePath => {
                if (this.fileHashes[filePath]) {
                    chunkFileHashes[filePath] = this.fileHashes[filePath];
                }
                if (this.fileContents[filePath]) {
                    chunkFileContents[filePath] = this.fileContents[filePath];
                }
            });

            const promise = this.pool.exec('processFiles', [this.config, chunk, chunkSize, this.cipherKey, this.shuffledKey, this.aesKey, this.loaded, chunkFileHashes, chunkFileContents])
                .then((result: { fileHashes: { [key: string]: string }, fileContents: { [key: string]: string } }) => {
                    this.log(`Processed chunk ${i + 1}/${this.config.threads}`);
                    // Update fileHashes and fileContents with the results from the worker
                    Object.assign(this.fileHashes, this.fileHashes, result.fileHashes);
                    Object.assign(this.fileContents, this.fileContents, result.fileContents);
                })
                .catch((err: any) => {
                    console.error(`Error processing chunk ${i + 1}/${this.config.threads}:`, err);
                });

            promises.push(promise);
        }

        Promise.all(promises).then(() => {
            this.log('All chunks processed successfully.');
            this.saveState();
        }).catch((err: any) => {
            console.error('Error processing all chunks:', err);
        });

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
