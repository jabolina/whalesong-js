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

        this.addSubManager("delivery", MessageAckManager, "delivery");
        this.addSubManager("read", MessageAckManager, "read");
        this.addSubManager("played", MessageAckManager, "played");
    }
}

export class MessageManager extends BaseModelManager {
    constructor(driver, name) {
        super(driver, name);

        this.subManagers.set("info", MessageInfoManager);
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
        super(driver, name, MessageManager);
    }

    monitorNew() {
        return this.executeCommand("monitorNew", {}, "MonitorResult");
    }
}
