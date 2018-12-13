export class BaseError {
    constructor(message) {
        this.message = message;
        this.name = this.constructor.name;
    }
}

export class StopIterator extends BaseError {}

// eslint-disable-next-line
export const dynamicInstantiation = ({ name, message }) => eval(`new ${name}("${message}")`);
