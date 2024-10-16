const { JohnsPheonixBox, Config } = require('./pheonix-box.js');

const runtimeConfig = new Config();
runtimeConfig.addPath('new/path'); // This will log a message to the console
runtimeConfig.debug = true; //enable console log debugs!
runtimeConfig.forkDelay = 1000; //how many milliseconds do you want to delay checks!
runtimeConfig.forkExecutionDelay = 1000; //how many milliseconds do you want to delay checks!
runtimeConfig.threads = 1; //Limit to single thread to not waste resources!
const pheonixBox = new JohnsPheonixBox(runtimeConfig);
pheonixBox.initRuntimeProtect(false, true, true, false);//This will automatically load up runtime configuration settings required!
pheonixBox.startProcess(); //This will start the process of checking for tampering!