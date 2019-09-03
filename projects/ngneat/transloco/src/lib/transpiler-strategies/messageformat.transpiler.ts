import { TranslocoTranspiler, DefaultTranspiler } from '../transloco.transpiler';
import { HashMap, Translation } from '../types';

import * as MessageFormat from 'messageformat';
import { getValue, setValue, isObject } from '../helpers';

/**
 *
 * @deprecated use @ngneat/transloco-messageformat
 *
 */
export class MessageFormatTranspiler implements TranslocoTranspiler {
  defaultTranspiler: DefaultTranspiler = new DefaultTranspiler();
  //@ts-ignore
  messageFormat: MessageFormat = new MessageFormat();

  transpile(value: any, params: HashMap<any> = {}, translation: Translation): any {
    if (!value) {
      return value;
    }

    if (isObject(value) && params) {
      Object.keys(params).forEach(p => {
        const v = getValue(value as Object, p);
        const getParams = getValue(params, p);

        const transpiled = this.defaultTranspiler.transpile(v, getParams, translation);
        const message = this.messageFormat.compile(transpiled);
        value = setValue(value, p, message(params[p]));
      });
    } else {
      const transpiled = this.defaultTranspiler.transpile(value, params, translation);

      const message = this.messageFormat.compile(transpiled);
      return message(params);
    }

    return value;
  }
}
