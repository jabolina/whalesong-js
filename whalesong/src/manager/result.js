import { fork } from "child_process";
import path from "path";


import { MESSAGE_TYPES } from "./sub-process/constants";
import {
    ExecuteCommand, dynamicInstantiation, BaseError, StopIterator,
} from "../error";
import { isType } from "../util";

class Result {
    constructor(id, result) {
        this.id = id;
        this.result = result;
        this.mapTo = {};
    }

    map(data) {
        return Object.assign(this.mapTo, data);
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    setMapTo(cls) {
        this.mapTo = cls;
    }

    setFinalResult(result) {
        if (isType.isString(result)) {
            this.result = result;
        } else {
            this.result = this.map(result);
        }
    }

    setPartialResult(result) {
        this.result = this.map(result);
    }

    setErrorResult(exception) {
        if (!(exception instanceof BaseError)) {
            this.result = new ExecuteCommand(exception.message);
        } else {
            this.result = exception;
        }
    }

    awaitResult() {
        const fullResultObject = this;
        function delayed() {
            return new Promise(resolve => setTimeout(resolve, 100));
        }

        function getResult() {
            return new Promise(resolve => resolve(fullResultObject.getResult()));
        }

        function poll() {
            return getResult().then((value) => {
                if (Object.keys(value).length) {
                    return value;
                }
                return delayed().then(poll);
            });
        }

        return poll();
    }

    getResult() {
        return this.result;
    }
}

export class BasePartialResult extends Result {
    constructor(id, result) {
        super(id, result);
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
        this.setErrorResult(new StopIterator("Stopping async iterator"));
    }
}

export class MonitorResult extends BasePartialResult {
    constructor(id, result) {
        super(id, result);

        this.worker = fork(path.join(__dirname, "sub-process", "result"), {
            detatched: true,
        });

        this.sendToWorker({
            messageType: MESSAGE_TYPES.CREATE,
            params: {
                id,
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
            this.worker.kill();
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

    requestResult(resultType, manage) {
        const id = this.genNextId();
        const constructorInString = `new ${resultType}('${id}', {});`;
        // eslint-disable-next-line
        const result = eval(constructorInString);
        result.setMapTo(manage);
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
