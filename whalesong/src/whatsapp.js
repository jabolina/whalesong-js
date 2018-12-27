/* eslint class-methods-use-this: 0 */
import puppeteer from "puppeteer";
import fs from "fs";

import { ResultManager } from "./manager/result";
import {
    WHATSAPP_WEB_URL, DEFAULT_CHROMIUM_ARGS, DEFAULT_DATA_DIR, SCRIPTLET_PATH,
} from "./constants";

const request = require("request").defaults({ encoding: null });

class WhatsAppInterface {
    constructor() {
        if (this.constructor === WhatsAppInterface) {
            throw Error("WhatsAppInterface can not be instantiated");
        }
    }

    async build() {
        throw Error("Implement `build` method");
    }

    async close() {
        throw Error("Implement `build` method");
    }

    async executeCommand() {
        throw Error("Implement `executeCommand` method");
    }
}

// eslint-disable-next-line
export class WhatsAppDriver extends WhatsAppInterface {
    constructor(headless, ...args) {
        super();
        const extraArguments = Object.assign({}, ...args);

        if (!("userDataDir" in extraArguments)) {
            extraArguments.userDataDir = DEFAULT_DATA_DIR;
        }

        this.puppetterOpt = {
            headless,
            args: DEFAULT_CHROMIUM_ARGS,
            ...extraArguments,
        };
        this.browser = undefined;
        this.page = undefined;
        this.resultManager = new ResultManager();
    }

    async refresh() {
        await this.page.goto(WHATSAPP_WEB_URL);
        await this.injectParasite();
    }

    async injectParasite() {
        const data = fs.readFileSync(SCRIPTLET_PATH);
        await this.page.evaluate(data.toString());
    }

    async internalStartDriver() {
        this.browser = await puppeteer.launch(this.puppetterOpt);
        [this.page] = (await this.browser.pages());
        await this.page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 "
        + "(KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36");
        await this.page.setViewport({ width: 800, height: 600 });
        await this.page.exposeFunction("whalesongPushResult", async (result) => {
            if (result) {
                try {
                    if (result.type === "FINAL") {
                        await this.resultManager.setFinalResult(result.exId, result.params);
                    } else if (result.type === "PARTIAL") {
                        await this.resultManager.setPartialResult(result.exId, result.params);
                    } else if (result.type === "ERROR") {
                        await this.resultManager.setErrorResult(result.exId, result.params);
                    }
                } catch (err) {
                    throw err;
                }
            }
            return { status: true };
        });
    }

    async build() {
        await this.internalStartDriver();
        await this.refresh();
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    cancelAll() {
        this.resultManager.getIterators()
            .forEach(iterator => iterator.setErrorResult({ message: "Canceling iterators", name: "StopIterator" }));
    }

    async evaluate(command) {
        await this.page.evaluate(command);
    }

    executeCommand(command, params = {}, resultType = "Result", manage = {}) {
        const resultObject = this.resultManager.requestResult(resultType, manage);
        const completeCommand = `(function() {{window.manager.executeCommand("${resultObject.getId()}", "${command}", ${JSON.stringify(params)})}})()`;
        return this.evaluate(completeCommand).then(() => resultObject.awaitResult().then(v => v));
    }

    async downloadFile(uri) {
        return new Promise((resolve) => {
            request.get({
                uri,
                headers: {
                    "User-Agent": "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0)",
                },
            }, (error, _response, body) => {
                if (!error) {
                    resolve(body);
                } else {
                    throw error;
                }
            });
        });
    }
}
