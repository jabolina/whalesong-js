import { BaseCollectionManager, BaseManager, BaseModelManager } from "./index";

class Chat extends BaseManager {}

export class ChatManager extends BaseModelManager {
    constructor(driver, name) {
        super(driver, name, Chat);
    }

    sendText(text, quotedMsgId = "", mentions = "", linkDesc = "") {
        const params = {
            text,
            quotedMsgId,
            mentions,
            linkDesc,
        };

        return super.executeCommand("sendText", params);
    }

    sendMedia(mediaData, contentType = "", fileName = "", caption = "", quotedMsgId = "", mentions = "") {
        const params = {
            mediaData,
            contentType,
            fileName,
            caption,
            quotedMsgId,
            mentions,
        };

        return super.executeCommand("sendMedia", params);
    }

    sendSeen() {
        return super.executeCommand("sendSeen");
    }

    deleteChat() {
        return super.executeCommand("deleteChat");
    }
}

export class ChatCollectionManager extends BaseCollectionManager {
    constructor(driver, name) {
        super(driver, name, ChatManager);
    }

    getActive() {
        return this.executeCommand("getActive");
    }

    ensureChatWithContact(contactId) {
        return this.executeCommand("ensureChatWithContact", { contactId });
    }

    getChatId(number) {
        return this.executeCommand("getChatId", { number });
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
