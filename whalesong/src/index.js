import { BaseManager } from "./manager";
import { WhatsAppDriver } from "./whatsapp";
import ConnectionManager from "./manager/connection";
import StreamManager from "./manager/stream";
import { ChatCollectionManager } from "./manager/chat";
import { MessageCollectionManager } from "./manager/message";
import StorageManager from "./manager/storage";
import WapManager from "./manager/wap";


// eslint-disable-next-line
export class WhatsApp extends BaseManager {
    constructor(headless, ...args) {
        super(new WhatsAppDriver(headless, ...args));

        this.subManagers.set("conn", new ConnectionManager(this.getDriver(), "conn"));
        this.subManagers.set("stream", new StreamManager(this.getDriver(), "stream"));
        this.subManagers.set("chats", new ChatCollectionManager(this.getDriver(), "chats"));
        this.subManagers.set("messages", new MessageCollectionManager(this.getDriver(), "messages"));
        this.subManagers.set("storage", new StorageManager(this.getDriver(), "storage"));
        this.subManagers.set("wap", new WapManager(this.getDriver(), "wap"));
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
        if (this.driver && this.driver.page) {
            const element = await this.driver.page.$("div[data-ref]");
            if (element) {
                data = await element.screenshot({ encoding: "base64" });
            }
        }

        return data;
    }

    async close() {
        this.driver.cancelAll();
        await this.driver.close();
    }
}
