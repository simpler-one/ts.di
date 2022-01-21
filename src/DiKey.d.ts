import Class from "./Class";

type DiKey = symbol | string | Class;

namespace DiKey {
    export function stringify(key: DiKey): string {
        return key instanceof Function ?  key.name : String(key);
    }
}

export default DiKey;
