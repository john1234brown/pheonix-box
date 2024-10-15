/************************************************************************************************************************
 * Author: Johnathan Edward Brown                                                                                       *
 * Purpose: CLI with worker thread entry point for the PheonixBox Class Object for the CLI Pheonix application.         *
 * Last Modified: 2024-10-14                                                                                            *
 * License: X11 License                                                                                                 *
 * Version: 1.0.0                                                                                                       *
 ************************************************************************************************************************/
import { Config } from './config';
import { JohnsPheonixBox } from './main';
import cluster from 'cluster';
import JohnsWorker from './worker';
export const clusterLock = { clusterLock: false};
if (cluster.isWorker) {
    // If this is a worker process, do nothing and return early
    console.log(`Worker ${process.pid} is running`);
    clusterLock.clusterLock = true;
    process.on('message', async (message) => {
        const msg = message as { type: string, chunk: string[], config: Config, cipherKey: string, shuffledKey: string, aesKey: Buffer | null, loaded: boolean, fileHashes: { [key: string]: string }, fileContents: { [key: string]: string } };
        if (msg.type === 'start') {
            console.log('Starting worker process...');
            const { chunk, config, cipherKey, shuffledKey, aesKey, loaded, fileHashes, fileContents } = message as { chunk: string[], config: Config, cipherKey: string, shuffledKey: string, aesKey: Buffer | null, loaded: boolean, fileHashes: { [key: string]: string }, fileContents: { [key: string]: string } };
            const worker = new JohnsWorker(config, chunk, {}, cipherKey, shuffledKey, aesKey || Buffer.alloc(0), loaded, fileHashes, fileContents);
            while (true) {
                const result = await worker.processFiles(chunk, {});
                if (process.send) process.send({ type: 'result', fileHashes: result.fileHashes, fileContents: result.fileContents });
                await new Promise(resolve => setTimeout(resolve, config.forkExecutionDelay || 1000)); // Add a configurable delay between executions
            }
        }
    });
}

const args = process.argv.slice(2);

if (args.length < 1 || args[0] === 'help') {
    if (clusterLock.clusterLock === false){
        displayHelp();
        process.exit(1);
    }
}

const command = args[0];
const action = args[1];

switch (command) {
    case 'config':
        handleConfig(action, args.slice(2));
        break;
    case 'start':
        if (clusterLock.clusterLock === false){
            const johnsPheonixBox = new JohnsPheonixBox();
            johnsPheonixBox.startProcess(); //Prevent dual executions from cluster modules!
        }
        break;
    default:
        if (clusterLock.clusterLock === false){
            console.error('Unknown command');
            displayHelp();
            process.exit(1);
        }
        break;
}

function handleConfig(action: string, options: string[]) {
    const config = new Config();
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
        case 'setSelfTamperProof':
            config.selfTamperProof = options[0] === 'true';
            config.saveConfigP();
            console.log(`selfTamperProof set to ${options[0]}`);
            break;
        case 'setSelfNpmTamperProof':
            config.selfNpmTamperProof = options[0] === 'true';
            config.saveConfigP();
            console.log(`selfNpmTamperProof set to ${options[0]}`);
            break;
        default:
            if (clusterLock.clusterLock === false){
                console.error('Unknown config action');
                displayHelp();
                process.exit(1);
            }
    }
    if (clusterLock.clusterLock === false)process.exit(0);
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
    console.log('  setSelfTamperProof <true|false> Set whether to use self tamper proof');
    console.log('  setSelfNpmTamperProof <true|false> Set whether to use self npm tamper proof');
}

export default JohnsPheonixBox;