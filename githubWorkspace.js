const fs = require('node:fs');
const path = require('node:path');
const fse = require('fs-extra');
const os = require('node:os');

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

class CopyPlugin {
  #lock;

  constructor(options = {}) {
    this.configFile = options.configFile || './configurable.json';
    this.#lock = false;
  }

  apply(compiler) {
    compiler.hooks.beforeCompile.tapAsync('CopyPlugin', (compilation, callback) => {
      echoCyan('===================================================================');
      echoCyan('   Johnnykins Webpack Multi OS Github Workspace Script in NodeJS   ');
      echoCyan('     If Any Errors Occur Please report them to the following!      ');
      echoCyan('   https://github.com/john1234brown/Johnnykins-MCSManager/issues   ');
      echoCyan('           [+]    Author: Johnathan Edward Brown                   ');
      echoCyan(`           [+]    Copyright ${new Date().getFullYear()}            `);
      echoCyan('===================================================================');
      try {
        // Step 1: Read configuration file for workspace directories
        const config = this.readConfig();

        if (config.workspaces){

          if (!Array.isArray(config.githubWorkspaces) || config.githubWorkspaces.length === 0) {
            echoRed('[!] Warning: GitHub workspaces are not configured or not configured properly. Please double check!');
            throw new Error('GitHub workspaces are not configured!');
          }

          if (!Array.isArray(config.localWorkspaces) || config.localWorkspaces.length !== config.githubWorkspaces.length) {
            echoRed('[!] Warning: Local workspaces are not configured or do not match the number of GitHub workspaces. Please double check!');
            throw new Error('Local workspaces are not configured or do not match the number of GitHub workspaces!');
          }

          // Step 2: Loop through each GitHub workspace and copy files from corresponding local workspace
          config.githubWorkspaces.forEach((githubWorkspace, index) => {
            const localWorkspace = config.localWorkspaces[index];
            const currentDir = path.join(process.cwd(), localWorkspace); // Current local workspace directory

            const root = os.platform() === 'win32' ? path.resolve(githubWorkspace.split(':')[0] + ":") : path.resolve('/');
            const workspaceDir = path.join(root, githubWorkspace);

            echoCyan('[+] GitHub workspace directory:', workspaceDir);
            echoCyan('[+] Local workspace directory:', currentDir);
            echoYellow('[+] Copying files to GitHub workspace...');

            this.#lock = true;
            checker.lock = true;
            fse.copySync(currentDir, workspaceDir, { overwrite: true, recursive: true });
            echoGreen('[+] Done! Files copied to:', workspaceDir);
          });
        }

        // Step 3: Handle the original implementations
        // Retain original implementation for pluginGithubWorkspace and original config.githubWorkspace entry
        const pluginGithubWorkspace = config.githubWorkspace;
        if (pluginGithubWorkspace) {
          const currentDir = path.join(process.cwd(), config.localWorkspace); // Use the current working directory
          const root = os.platform() === 'win32' ? path.resolve(pluginGithubWorkspace.split(':')[0] + ":") : path.resolve('/');
          const workspaceDir = path.join(root, pluginGithubWorkspace);

          echoCyan('[+] Plugin GitHub workspace directory:', workspaceDir);
          echoCyan('[+] Local workspace directory:', root);

          echoYellow('[+] Copying files to Plugin GitHub workspace...');
          this.#lock = true;
          checker.lock = true;
          fse.copySync(currentDir, workspaceDir, { overwrite: true, recursive: true });
          echoGreen('[+] Done! Files copied to:', workspaceDir);
        }
        this.#lock = true;
        checker.lock = true;
        callback();
      } catch (err) {
        if (this.#lock || checker.lock){
          return;
        }else{
          console.error('Error during the Copy process:', err);
          callback(err);
        }
      }
    });
  }

  // Helper function to read and parse the configurable.json file
  readConfig() {
    if (!fs.existsSync(this.configFile)) {
      throw new Error(`Configuration file not found: ${this.configFile}`);
    }
    const configContent = fs.readFileSync(this.configFile, 'utf-8');
    checker.lock = true;
    return JSON.parse(configContent);
  }
}

module.exports = CopyPlugin;
