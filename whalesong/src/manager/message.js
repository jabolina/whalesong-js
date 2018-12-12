import { BaseModelManager } from "./index";

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

    async downloadMedia() {}

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

export class MessageCollectionManager extends MessageManager {
    monitorNew() {
        return this.executeCommand("monitorNew", {}, "MonitorResult");
    }
}
