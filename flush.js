const fs = require('fs');
const path = require('path');

// Clear the console
function clearConsole(){
process.stdout.write("\x1Bc");
}

// Function to print cyan text
function echoCyan(...text) {
    console.log('\x1b[1;36m%s\x1b[0m', ...text);
}

// Function to print red text
function echoRed(...text) {
    console.log('\x1b[1;31m%s\x1b[0m', ...text);
}

// Function to print green text
function echoGreen(...text) {
    console.log('\x1b[1;32m%s\x1b[0m', ...text);
}

// Function to print yellow text
function echoYellow(...text) {
    console.log('\x1b[1;33m%s\x1b[0m', ...text);
}
const checker = { lock: false };

class FlushPlugin {
  apply(compiler) {
    compiler.hooks.beforeRun.tapAsync('FlushPlugin', (compilation, callback) => {
      try {
        echoCyan('===================================================================');
        echoCyan('   Johnnykins Webpack Multi OS Flush Workspace Script in NodeJS    ');
        echoCyan('     If Any Errors Occur Please report them to the following!      ');
        echoCyan('   https://github.com/john1234brown/Johnnykins-MCSManager/issues   ');
        echoCyan('           [+]    Author: Johnathan Edward Brown                   ');
        echoCyan(`           [+]    Copyright ${new Date().getFullYear()}            `);
        echoCyan('===================================================================');
        echoGreen('[+] Flushing node_modules and other directories!');

        const directoriesToRemove = [
          './pheonix/node_modules/',
          './pheonix/.webpack_cache/',
          //'./pheonix/production/',
          './node_modules'
        ];

        directoriesToRemove.forEach(dir => {
          this.removeDirectory(path.resolve(dir));
        });

        echoGreen("[+] Flushed All Node_Modules and related directories!");
        callback();
      } catch (err) {
        echoRed('========================================================================');
        echoRed('  WARNING FLUSHING WORKSPACE FAILED Please report the following error!  ');
        echoRed('    To: https://github.com/john1234brown/Johnnykins-MCSManager/issues   ');
        echoRed('             [+]    Author: Johnathan Edward Brown                      ');
        echoRed(`             [+]    Copyright ${new Date().getFullYear()}               `);
        echoRed('========================================================================');
        console.log('Error during custom build process:', err);
        callback(err);
      }
    });
  }

  removeDirectories(dirs) {
    dirs.forEach((dir) => this.removeDirectory(dir));
  }

  removeDirectory(dir) {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      echoGreen(`[+] Removed directory: ${dir}`);
    } else {
      echoRed(`[-] Directory not found: ${dir}`);
    }
  }
}

module.exports = FlushPlugin;
