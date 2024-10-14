import { Config } from './config';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as sea from 'node:sea'; // Assuming 'sea' is a module for handling sea assets
import { generateSafeUtf8Characters } from './char';
import JohnsWorker from './worker'; // Import the Worker class from worker.ts
import cluster from 'cluster';
import * as os from 'os';
import { clusterLock } from './cli';

const STATE_FILE_PATH = path.join(process.cwd(), 'pheonixBoxState.json');

export class JohnsPheonixBox {
    private config: Config;
    private fileHashes: { [key: string]: string } = {};
    private fileContents: { [key: string]: string } = {};
    private cipherKey: string = '';
    private shuffledKey: string = '';
    private safeAsciiCharacters: string[] = [];
    private aesKey: Buffer | null = null;
    private loaded: boolean;

    constructor(useSeaAsset: boolean = false, assetLocation: string = '') {
        this.loaded = false;
        if (useSeaAsset && assetLocation) {
            this.config = this.loadConfigFromSeaAsset(assetLocation);
        } else {
            this.config = new Config();
            this.config.saveConfigP();
            this.loadState();
        }
        this.log('Initializing JohnsPheonixBox...');
        console.log('This loaded:', this.loaded);
        if (this.loaded === false) {
            this.safeAsciiCharacters = generateSafeUtf8Characters(this.config.whiteSpaceOffset);
            this.cipherKey = this.generateCipherKey();
            this.shuffledKey = this.shuffleKey(this.cipherKey);
            if (this.config.useAesKey) {
                this.aesKey = crypto.randomBytes(32); // Use 256-bit key size
            }
        }

        process.on('exit', (code) => {
            if (code !== 369){
                if (clusterLock.clusterLock === false)this.saveState();
            }
        });
        
        process.on('SIGINT', () => {
            if (clusterLock.clusterLock === false)this.saveState();
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
        if (cluster.isPrimary) {
            let numCPUs = os.cpus().length;
            if (numCPUs > this.config.threads) numCPUs = this.config.threads; // If configurations for threads is lower than the numCpu threads use that!
            const fileList = this.getFileList();
            const chunkSize = Math.ceil(fileList.length / numCPUs);

            this.log(`Master ${process.pid} is running`);
            
            // Fork workers.
            let i = 0;
            const forkWorker = () => {
                if (i < numCPUs) {
                    const chunk = fileList.slice(i * chunkSize, (i + 1) * chunkSize);
                    const worker = cluster.fork();

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

            forkWorker();

            cluster.on('exit', (worker, code, signal) => {
                this.log(`Worker ${worker.process.pid} died`);
            });

        }
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

    private shuffleKeys(array: string[]): string[] {
        this.log('Shuffling key...');
        for (let i = array.length - 1; i > 0; i--) {
            const j = crypto.randomInt(0, i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    private shuffleKey(key: string): string {
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

//const johnsPheonixBox = new JohnsPheonixBox();
//johnsPheonixBox.startProcess();