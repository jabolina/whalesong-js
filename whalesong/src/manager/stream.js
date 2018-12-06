import {BaseManager, BaseModelManager } from ".";

class Stream extends BaseManager {
    constructor(driver, name) {
        super(driver, name);

        this.state = {
            OPENING: "OPENING",
            PAIRING: "PAIRING",
            UNPAIRED: "UNPAIRED",
            UNPAIRED_IDLE: "UNPAIRED_IDLE",
            CONNECTED: "CONNECTED",
            TIMEOUT: "TIMEOUT",
            CONFLICT: "CONFLICT",
            UNLAUNCHED: "UNLAUNCHED",
            PROXYBLOCK: "PROXYBLOCK",
            TOS_BLOCK: "TOS_BLOCK",
            SMB_TOS_BLOCK: "SMB_TOS_BLOCK",
        };

        this.stream = {
            DISCONNECTED: "DISCONNECTED",
            SYNCING: "SYNCING",
            RESUMING: "RESUMING",
            CONNECTED: "CONNECTED",
        };
    }
}

class StreamManager extends BaseModelManager {
    constructor(driver, name) {
        super(driver, name);
        this.MODEL_CLASS = new Stream(driver, name);
    }

    poke() {
        return this.executeCommand("poke");
    }
}

export default StreamManager;
