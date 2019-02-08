import { BaseManager, BaseModelManager } from ".";

class Wap extends BaseManager {}

class WapManager extends BaseModelManager {
    constructor(driver, name) {
        super(driver, name, Wap);
    }

    getCapabilities(contactId) {
        return super.executeCommand("getCapabilities", { contactId });
    }

    queryExist(contactId) {
        return super.executeCommand("queryExist", { contactId });
    }

    queryLinkPreview(text) {
        return super.executeCommand("queryLinkPreview", { text });
    }

    subscribePresence(id) {
        return super.executeCommand("subscribePresence", { id });
    }
}

export default WapManager;
