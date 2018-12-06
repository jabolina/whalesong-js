/* eslint class-methods-use-this: 0 */
import puppeteer from "puppeteer";
import fs from "fs";
import winston from "winston";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(info => `[${info.timestamp}] --- [${info.level}]: ${info.message}`),
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: "whatsapp-puppeteer.log",
            level: "verbose",
        }),
    ],
});

import ResultManager from "./manager/result";
import { WHATSAPP_WEB_URL, DEFAULT_CHROMIUM_ARGS, SCRIPTLET_PATH } from "./constants";

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
        this.puppetterOpt = {
            headless,
            args: DEFAULT_CHROMIUM_ARGS,
            ...args,
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
        await this.page.on("console", ({ _text }) => logger.info(`[PUPPETEER]: ${_text}`));
        await this.page.exposeFunction("whalesongPushResult", (result) => {
            if (result) {
                try {
                    if (result.type === "FINAL") {
                        this.resultManager.setFinalResult(result.exId, result.params);
                    } else if (result.type === "PARTIAL") {
                        this.resultManager.setPartialResult(result.exId, result.params);
                    } else if (result.type === "ERROR") {
                        this.resultManager.setErrorResult(result.exId, result.params);
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

    async evaluate(command) {
        return this.page.mainFrame().evaluate(command);
    }

    executeCommand(command, params = {}, resultType = "Result") {
        const resultObject = this.resultManager.requestResult(resultType);
        const completeCommand = `(function() {{window.manager.executeCommand("${resultObject.getId()}", "${command}", ${JSON.stringify(params)})}})()`;
        return this.evaluate(completeCommand).then(() => resultObject);
    }
}