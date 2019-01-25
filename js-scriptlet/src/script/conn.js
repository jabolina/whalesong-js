import { command } from '../manager.js';
import { ModelManager } from './common.js';

export class ConnManager extends ModelManager {
  @command
  async updatePushname({
    name
  }) {
    await this.model.updatePushname(name);
  }

  @command
  async canSetMyPushname() {
    await this.model.canSetMyPushname();
  }
}