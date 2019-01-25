export class BaseError {
    constructor(message) {
        this.message = message;
        this.name = this.constructor.name;
    }
}

export class ExecuteCommand extends BaseError {}

export class StopIterator extends BaseError {
    // eslint-disable-next-line class-methods-use-this
    close(worker) {
        worker.close();
    }
}

export class DecryptionError extends BaseError {}

// eslint-disable-next-line
export const dynamicInstantiation = ({ name, message }) => eval(`new ${name}("${message}")`);
