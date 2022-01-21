import Class from "./Class";
import DiConfig from "./DiConfig";
import DiKey from "./DiKey";
import DiLifetime from "./DiLifetime";
import Factory from "./Factory";


class DiDefiner {
    private static readonly ProvisionSymbol = Symbol("provision");
    private static readonly DependencySymbol = Symbol("Dependency");

    //
    // Public

    public static get(type: Class): DiConfig {
        return {
            provision: type[this.ProvisionSymbol],
            dependency: type[this.DependencySymbol],
        };
    }

    public static injectable(type: Class, opt?: DiDefiner.Opt): void {
        DiDefiner.fromOptions(type, undefined, opt);
    }

    public static singleton(type: Class, opt?: DiDefiner.Opt): void {
        DiDefiner.fromOptions(type, DiLifetime.Singleton, opt);
    }

    public static scoped(type: Class, opt?: DiDefiner.Opt): void {
        DiDefiner.fromOptions(type, DiLifetime.Scoped, opt);
    }

    public static transient(type: Class, opt?: DiDefiner.Opt): void {
        DiDefiner.fromOptions(type, DiLifetime.Transient, opt);
    }

    public static depends(type: Class, init: DiKey[], props?: { [key: string]: DiKey }): void {
        type[this.DependencySymbol] = { init, props } as DiConfig.Dependency;
    }

    //
    // Private

    private static fromOptions(type: Class, lifetime: DiLifetime, opt?: DiDefiner.Opt): void {
        type[this.ProvisionSymbol] = {
            keys: toArray(opt?.as),
            factory: opt?.factory,
            lifetime,
        } as DiConfig.Provision;
    }
}

namespace DiDefiner {
    export type Opt = {
        as?: DiKey | DiKey[]
        factory?: Factory,
    };
}

export default DiDefiner;


function toArray<T>(item: T | T[]): T[] {
    if (item === undefined) {
        return undefined;
    }

    return item instanceof Array ? item : [item];
}
