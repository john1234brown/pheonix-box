// Author: Johnathan Edward Brown
// Purpose: Main entry point for the CLI Pheonix application.
// Last Modified: 2024-10-13
import { Config } from './config';
import { JohnsPheonixBox } from './main';

const args = process.argv.slice(2);

if (args.length < 1 || args[0] === 'help') {
    displayHelp();
    process.exit(1);
}

const command = args[0];
const action = args[1];

const johnsPheonixBox = new JohnsPheonixBox();

switch (command) {
    case 'config':
        handleConfig(action, args.slice(2));
        break;
    case 'start':
        johnsPheonixBox.startProcess();
        break;
    default:
        console.error('Unknown command');
        displayHelp();
        process.exit(1);
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
        case 'setInterval':
            config.interval = parseInt(options[0], 10);
            config.saveConfigP();
            console.log(`interval set to ${options[0]}`);
            break;
        case 'setDebug':
            config.debug = options[0] === 'true';
            config.saveConfigP();
            console.log(`debug set to ${options[0]}`);
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
    console.log('  addFileType <type>         Add a file type to the configuration');
    console.log('  removeFileType <type>      Remove a file type from the configuration');
    console.log('  addFileRegex <regex>       Add a file regex to the configuration');
    console.log('  removeFileRegex <regex>    Remove a file regex from the configuration');
    console.log('  setUseFileTypes <true|false> Set whether to use file types');
    console.log('  setUseFileRegexs <true|false> Set whether to use file regexs');
    console.log('  setUseCeaserCipher <true|false> Set whether to use Ceaser Cipher');
    console.log('  setUseAesKey <true|false>  Set whether to use AES Key');
    console.log('  setThreads <number>        Set the number of threads');
    console.log('  setInterval <number>       Set the interval');
    console.log('  setDebug <true|false>      Set the debug mode');
}