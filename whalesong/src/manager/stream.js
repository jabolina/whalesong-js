import {BaseManager, BaseModelManager} from "./index";

class Stream extends BaseManager {
    state = {
        OPENING: "OPENING",
        PAIRING: "PAIRING",
        UNPAIRED: "UNPAIRED",
        UNPAIRED_IDLE: "UNPAIRED_IDLE",
        CONNECTED: "CONNECTED",
        TIMEOUT: "TIMEOUT",
        CONFLICT: "CONFLICT",
        UNLAUNCHED: "UNLAUNCHED",
        PROXYBLOCK: 'PROXYBLOCK',
        TOS_BLOCK: "TOS_BLOCK",
        SMB_TOS_BLOCK: "SMB_TOS_BLOCK"
    };

    stream = {
        DISCONNECTED: "DISCONNECTED",
        SYNCING: "SYNCING",
        RESUMING: "RESUMING",
        CONNECTED: "CONNECTED",
    };
}

class StreamManager extends BaseModelManager {
    MODEL_CLASS = new Stream(this.getDriver(), this.getName());

    poke() {
        return this.executeCommand("poke");
    }
}

export default StreamManager;
