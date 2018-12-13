import { fork } from "child_process";
import path from "path";

import { MESSAGE_TYPES } from "./sub-process/constants";
import{ dynamicInstantiation } from "../error";

class Result {
    constructor(id, name, result) {
        this.id = id;
        this.name = name;
        this.result = result;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    setFinalResult(result) {
        this.result = result;
    }

    setPartialResult(result) {
        this.result = result;
    }

    setErrorResult(exception) {
        this.result = exception;
    }

    getResult() {
        return this.result;
    }
}

export class BasePartialResult extends Result {
    constructor(id, name, result) {
        super(id, name, result);
        this.queue = [];
        this.keepRunning = true;
    }

    setFinalResult(result) {
        super.setFinalResult(result);
        this.queue.push(result);
    }

    setErrorResult(error) {
        const exception = dynamicInstantiation(error);
        super.setErrorResult(exception);
        this.queue.push(exception);
    }

    setPartialResult(partial) {
        super.setPartialResult(partial);
        this.queue.push(partial);
    }

    cancel() {
        this.keepRunning = false;
        this.setErrorResult(new Error("Stopping async iterator"));
    }
}

export class MonitorResult extends BasePartialResult {
    constructor(id, name, result) {
        super(id, name, result);

        this.worker = fork(path.join(__dirname, "sub-process", "result"), {
            detatched: true,
        });

        this.sendToWorker({
            messageType: MESSAGE_TYPES.CREATE,
            params: {
                id,
                name,
                result,
            },
        });
    }

    async sendToWorker(envelope) {
        this.worker.send(envelope);
    }

    getResult() {
        this.sendToWorker({
            messageType: MESSAGE_TYPES.RESULT,
            params: {
                content: "getResult",
            },
        });

        return this.worker;
    }

    setPartialResult(partial) {
        this.sendToWorker({
            messageType: MESSAGE_TYPES.METHOD,
            params: {
                method: "setPartialResult",
                content: partial,
            },
        });
    }

    setErrorResult(error) {
        this.sendToWorker({
            messageType: MESSAGE_TYPES.METHOD,
            params: {
                method: "setErrorResult",
                content: error,
            },
        });
    }

    cancel() {
        super.cancel();
        if (this.worker) {
            this.worker.disconnect();
        }
    }
}

export class ResultManager {
    constructor() {
        this.id = 1;
        this.results = new Map();
    }

    genNextId() {
        // eslint-disable-next-line
        return `${this.id++}`;
    }

    requestResult(resultType) {
        const name = Math.random().toString(36).substr(0, 10);
        const id = this.genNextId();
        const constructorInString = `new ${resultType}('${id}', '${name}', {});`;
        // eslint-disable-next-line
        const result = eval(constructorInString);
        this.results.set(id, result);

        return result;
    }

    getIterators() {
        const iterators = [];
        this.results.forEach((value) => {
            if (value instanceof MonitorResult) {
                iterators.push(value);
            }
        });
        return iterators;
    }

    async setFinalResult(resultId, result) {
        await this.results.get(resultId).setFinalResult(result);
    }

    async setPartialResult(resultId, result) {
        await this.results.get(resultId).setPartialResult(result);
    }

    async setErrorResult(resultId, result) {
        await this.results.get(resultId).setErrorResult(result);
    }
}
