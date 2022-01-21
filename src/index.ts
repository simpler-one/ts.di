import Class from "./Class";
import DiContainer from "./DiContainer";
import DiDefiner from "./DiDefiner";
import DiKey from "./DiKey";


namespace DI {
    export function injectable(type: Class, opt?: DiDefiner.Opt): void {
        DiDefiner.injectable(type, opt);
    }

    export function singleton(type: Class, opt?: DiDefiner.Opt): void {
        DiDefiner.singleton(type, opt);
    }

    export function scoped(type: Class, opt?: DiDefiner.Opt): void {
        DiDefiner.scoped(type, opt);
    }

    export function transient(type: Class, opt?: DiDefiner.Opt): void {
        DiDefiner.transient(type, opt);
    }

    export function depends(type: Class, init: DiKey[], props?: { [key: string]: DiKey }): void {
        DiDefiner.depends(type, init, props);
    }

    export const Container = DiContainer;
}

export default DI;
