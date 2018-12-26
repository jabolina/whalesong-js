import { COMMAND_SEPARATOR } from "../constants";

export class BaseManager {
    constructor(driver = null, baseName = "", managingObject = {}) {
        this.driver = driver;
        this.baseName = baseName;
        this.manageObject = managingObject;
        this.subManagers = new Map();
    }

    getDriver() {
        return this.driver;
    }

    getName() {
        return this.baseName;
    }

    static buildCommand(func, baseName) {
        return `${baseName}${COMMAND_SEPARATOR}${func}`;
    }

    executeCommand(command, args, resultType) {
        const cmd = BaseManager.buildCommand(command, this.baseName);
        return this.driver.executeCommand(cmd, args, resultType, this.manageObject);
    }

    addSubManager(name, sub) {
        this.subManagers.set(name, sub);
    }

    removeSubManager(name) {
        this.subManagers.delete(name);
    }

    getSubManager(name) {
        return this.subManagers.get(name);
    }
}

export class BaseModelManager extends BaseManager {
    getModel() {
        return this.executeCommand("getModel");
    }

    static buildCommand(cmd, id) {
        return id
            ? `${id}${COMMAND_SEPARATOR}${cmd}`
            : cmd;
    }

    executeCommand(command, args, resultType) {
        return super.executeCommand(
            BaseModelManager.buildCommand(command, this.id), args, resultType,
        );
    }

    monitorModel() {
        return this.executeCommand("monitorModel", {}, "MonitorResult");
    }

    monitorField(field) {
        return this.executeCommand("monitorField", { field }, "MonitorResult");
    }
}

export class BaseCollectionManager extends BaseModelManager {
    getLength() {
        return this.executeCommand("getLength");
    }

    getItems() {
        return this.executeCommand("getItems");
    }

    async getItemById(id) {
        return this.executeCommand("getItemById", { id });
    }

    removeItemById(id) {
        return this.executeCommand("removeItemById", { id });
    }

    getFirst() {
        return this.executeCommand("getFirst");
    }

    getLast() {
        return this.executeCommand("getLast");
    }

    addMonitor() {
        return this.executeCommand("monitorAdd");
    }

    removeMonitor() {
        return this.executeCommand("monitorRemove");
    }

    changeMonitor() {
        return this.executeCommand("monitorChange", {}, "MonitorResult");
    }

    monitorField(field) {
        return this.executeCommand("monitorField", { field }, "MonitorResult");
    }

    getSubManager(name) {
        try {
            return super.getSubManager(name);
        } catch (err) {
            return this;
        }
    }
}
