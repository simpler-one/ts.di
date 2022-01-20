import Type from "./Type";
import DiKey from "./DiKey";

type DiKey = string | Type


export default class DiConfig {
    public constructor(
        public readonly type: Type,
        public readonly key: DiKey[],
        public readonly layer: string,
        public readonly dependencies: DiKey[],
    ) {
    }

    public static getKeys(type: Type): DiKey[] {
        return [type, type.name];
    }
}
