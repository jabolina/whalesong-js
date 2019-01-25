import MainManager from './manager.js';
import createManagers from './script'


window.manager = new MainManager();

createManagers(window.manager);