import { BaseManager, BaseModelManager } from ".";

class Storage extends BaseManager {}

class StorageManager extends BaseModelManager {
    constructor(driver, name) {
        super(driver, name, new Storage(driver, name));
    }

    getStorage() {
        return this.executeCommand("getStorage");
    }

    getItem(key) {
        return this.executeCommand("getItem", { key });
    }

    setItem(key, value) {
        return this.executeCommand("setItem", { key, value });
    }

    setStorage(data) {
        return this.executeCommand("setStorage", { data });
    }

    monitorStorage() {
        return this.executeCommand("monitorStorage");
    }

    monitorItemStorage() {
        return this.executeCommand("monitorItemStorage", {}, "MonitorResult");
    }
}

export default StorageManager;
