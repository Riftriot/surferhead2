import SandboxBase from '../../base';
import INSTRUCTION from '../../../../processing/script/instruction';
import nativeMethods from '../../native-methods';

export default class TopAccessorInstrumentation extends SandboxBase {
    constructor () {
        super();
    }

    static _topGetter (owner: Window) {
        try {
            // @ts-ignore
            return owner.__surferhead_proxied_iframe_top;
        }
        catch {
            return owner.top;
        }
    }

    attach (window: Window & typeof globalThis) {
        super.attach(window);

        // NOTE: In Google Chrome, iframes whose src contains html code raise the 'load' event twice.
        // So, we need to define code instrumentation functions as 'configurable' so that they can be redefined.
        nativeMethods.objectDefineProperty(window, INSTRUCTION.getTop, {
            value:        TopAccessorInstrumentation._topGetter,
            configurable: true,
        });

        nativeMethods.objectDefineProperty(window, INSTRUCTION.setLocation, {
            value: () => {
                return null;
            },

            configurable: true,
        });
    }
}
