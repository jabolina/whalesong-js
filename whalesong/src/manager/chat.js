import {BaseCollectionManager, BaseManager, BaseModelManager} from "./index";

class Chat extends BaseManager {}

export class ChatManager extends BaseModelManager {
    MODEL_CLASS = Chat;

    sendText(text, quotedMsgId = "", mentions = "", linkDesc = "") {
        const params = {
            text,
            quotedMsgId,
            mentions,
            linkDesc,
        };

        return super.executeCommand("sendText", params);
    }

    sendSeen() {
        return super.executeCommand("sendSeen");
    }

    deleteChat() {
        return super.executeCommand("deleteChat");
    }
}

export class ChatCollectionManager extends BaseCollectionManager {
    MODEL_MANAGER_CLASS = new ChatManager(this.getDriver(), "chats");

    getActive() {
        return this.executeCommand("getActive");
    }

    createGroup(name, contactIds, picture = "", picturePreview = "") {
        const params = {
            name,
            contactIds,
            picture,
            picturePreview,
        };

        return this.executeCommand("createGroup", params);
    }
}
