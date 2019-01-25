import {
  ModelManager
} from './common.js';

import {
  command
} from '../manager.js';

export class WapManager extends ModelManager {

  @command
  async queryExist({
    contactId
  }) {
    let result = await this.model.queryExist(contactId);
    if (result.status === 200) {
      return true;
    }
    return false;
  }

  @command
  async getCapabilities({
    contactId
  }) {
    const result = await this.model.getCapabilities([contactId]);
    return !!result[contactId];
  }

  @command
  async queryLinkPreview({
    text
  }) {
    let result = await this.model.queryLinkPreview(text);

    if (result.status && result.status !== 200) {
      return;
    }

    return result;
  }

  @command
  async subscribePresence({
    id
  }) {
    return await this.model.subscribePresence(id)
  }
}