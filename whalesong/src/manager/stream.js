import { BaseManager, BaseModelManager } from ".";

class Stream extends BaseManager {}

class StreamManager extends BaseModelManager {
    constructor(driver, name) {
        super(driver, name, Stream);
    }

    poke() {
        return this.executeCommand("poke");
    }
}

export default StreamManager;
