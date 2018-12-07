import { BaseManager } from "./manager";
import { WhatsAppDriver } from "./whatsapp";
import ConnectionManager from "./manager/connection";
import StreamManager from "./manager/stream";
import { ChatCollectionManager } from "./manager/chat";
import { MessageCollectionManager } from "./manager/message";
import StorageManager from "./manager/storage";


// eslint-disable-next-line
export class WhatsApp extends BaseManager {
    constructor(headless, ...args) {
        super(new WhatsAppDriver(headless, args));

        this.subManagers.set("conn", new ConnectionManager(this.getDriver(), "conn"));
        this.subManagers.set("stream", new StreamManager(this.getDriver(), "stream"));
        this.subManagers.set("chats", new ChatCollectionManager(this.getDriver(), "chats"));
        this.subManagers.set("messages", new MessageCollectionManager(this.getDriver(), "messages"));
        this.subManagers.set("storage", new StorageManager(this.getDriver(), "storage"));
    }

    async build() {
        return this.driver.build();
    }

    async screenshot() {
        if (!this.page) {
            return "";
        }
        return this.page.screenshot({ encoding: "base64" });
    }

    async qrCode() {
        let data;
        if (this.page) {
            const element = await this.page.$("div[data-ref]");
            if (element) {
                data = await element.screenshot({ encoding: "base64" });
            }
        }

        return data;
    }
}
