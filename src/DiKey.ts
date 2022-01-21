import Class from "./Class";

type DiKey<T = any> = symbol | string | Class<T>;

namespace DiKey {
    export function stringify(key: DiKey): string {
        return key instanceof Function ?  key.name : String(key);
    }
}

export default DiKey;
