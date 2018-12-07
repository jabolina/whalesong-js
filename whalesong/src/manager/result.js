import EventEmitter from "events";

class Result extends EventEmitter {
    constructor(id, name, result) {
        super();
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
        this.emit("result", result);
        this.result = result;
    }

    setPartialResult(result) {
        this.emit("result", result);
        this.result = result;
    }

    setErrorResult(exception) {
        this.emit("error", exception);
        this.result = exception;
    }

    getResult() {
        return this.result;
    }
}

class BasePartialResult extends Result {
    constructor(id, name, result) {
        super(id, name, result);
        this.queue = [];
        this.keepRunning = true;
    }

    setFinalResult(result) {
        super.setFinalResult(result);
        this.queue.push(result);
    }

    setErrorResult(exception) {
        super.setErrorResult(exception);
        this.queue.push(exception);
    }

    setPartialResult(data) {
        super.setPartialResult(data);
        this.queue.push(data);
    }

    cancel() {
        this.keepRunning = false;
        this.setErrorResult(new Error("Stopping async iterator"));
    }
}

// eslint-disable-next-line
class MonitorResult extends BasePartialResult {
    async* next() {
        while (this.keepRunning) {
            if (this.queue.length) {
                const value = this.queue.shift();

                if (value instanceof Error) {
                    yield { done: true };
                    break;
                }

                yield { value, done: false };
            }
        }
    }

    getResult = () => ((that) => ({
        [Symbol.asyncIterator]() {
            return that.next();
        }
    }))(this);
}

class ResultManager {
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
        const constructorInString = `new ${resultType}('${id}', '${name}', undefined);`;
        // eslint-disable-next-line
        const result = eval(constructorInString);
        this.results.set(id, result);

        return result;
    }

    setFinalResult(resultId, result) {
        this.results.get(resultId).setFinalResult(result);
    }

    setPartialResult(resultId, result) {
        this.results.get(resultId).setPartialResult(result);
    }

    setErrorResult(resultId, result) {
        this.results.get(resultId).setErrorResult(result);
    }
}

export default ResultManager;
