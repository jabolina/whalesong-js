import { BaseModelManager, BaseCollectionManager } from "./index";
import { decrypt } from "../crypto";

const downloadMedia = async (driver, model) => {
    const dataBuffer = await driver.downloadFile(model.clientUrl);

    try {
        return decrypt(dataBuffer, model);
    } catch (error) {
        throw error;
    }
};


export class MessageAckManager extends BaseModelManager {
    // no empty
}

class MessageInfoManager extends BaseModelManager {
    constructor(driver, name) {
        super(driver, name);

        this.addSubManager("delivery", new MessageAckManager(driver, name), "delivery");
        this.addSubManager("read", new MessageAckManager(driver, name), "read");
        this.addSubManager("played", new MessageAckManager(driver, name), "played");
    }
}

export class MessageManager extends BaseModelManager {
    constructor(driver, name) {
        super(driver, name);

        this.subManagers.set("info", new MessageInfoManager(driver, name));
    }

    async downloadMedia(model) {
        return downloadMedia(this.driver, model);
    }

    fetchInfo() {
        return this.executeCommand("fetchInfo");
    }

    star() {
        return this.executeCommand("star");
    }

    unstar() {
        return this.executeCommand("unstar");
    }
}

export class MessageCollectionManager extends BaseCollectionManager {
    constructor(driver, name) {
        super(driver, name, new MessageManager(driver, name));
    }

    monitorNew() {
        return this.executeCommand("monitorNew", {}, "MonitorResult");
    }
}
