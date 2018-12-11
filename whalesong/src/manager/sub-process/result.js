import { BasePartialResult } from "../result";
import { MESSAGE_TYPES } from "./constants";

class PartialResultSubProcess extends BasePartialResult {
    constructor(id, name, result) {
        super(id, name, result);

        this.writeLock = false;
    }

    async* getResultGenerator() {
        if (this.queue.length) {
            const value = this.queue.shift();

            yield ({ value, done: false });
        }
    }

    async getResult() {
        if (!this.writeLock) {
            for await (const { value, done } of this.getResultGenerator()) {
                if (done) {
                    process.exit(0);
                    break;
                }

                process.send(value);
            }
        }

        const that = this;
        setTimeout(() => {
            that.getResult.call(that);
        }, 250);
    }

    setPartialResult(partial) {
        this.writeLock = true;
        super.setPartialResult(partial);
        this.writeLock = false;
    }
}

let resultClass = null;

process.on("message", (envelope) => {
    const { messageType, params } = envelope;

    if (MESSAGE_TYPES.CREATE === messageType) {
        resultClass = Object.assign(new PartialResultSubProcess(), params);
    } else if (MESSAGE_TYPES.METHOD === messageType) {
        resultClass[params.method](params.content);
    } else if (MESSAGE_TYPES.RESULT === messageType) {
        return resultClass[params.content]();
    }

    return true;
});
