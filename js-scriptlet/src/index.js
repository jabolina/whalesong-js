import MainManager from './manager.js';
import createManagers from './script/index.js'


window.manager = new MainManager();

createManagers(window.manager);
