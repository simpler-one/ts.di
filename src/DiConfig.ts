import Class from "./Class";
import DiKey from "./DiKey";
import DiLifetime from "./DiLifetime";
import Factory from "./Factory";


interface DiConfig {
    provision: DiConfig.Provision;
    dependency?: DiConfig.Dependency;
}

namespace DiConfig {

    export function merge(type: Class, base: DiConfig | undefined, override: DiConfig): DiConfig {
        return {
            provision: Provision.merge(type, base?.provision ?? {}, override.provision),
            dependency: Dependency.merge(base.dependency ?? {} as Dependency, override.dependency ?? {} as Dependency),
        };
    }


    //
    // Provision

    export interface Provision {
        keys?: DiKey[];
        factory?: Factory;
        lifetime?: DiLifetime;
    }


    export namespace Provision {
        export function singleton(keys: DiKey[], factory: Factory): Provision {
            return create(keys, factory, DiLifetime.Singleton);
        }

        export function scoped(keys: DiKey[], factory: Factory): Provision {
            return create(keys, factory, DiLifetime.Scoped);
        }

        export function transient(keys: DiKey[], factory: Factory): Provision {
            return create(keys, factory, DiLifetime.Transient);
        }

        export function validate(config: Provision): boolean {
            return config.factory instanceof Function && 0 < config.keys?.length && config.lifetime !== undefined;
        }

        function create(keys: DiKey[], factory: Factory, lifetime: DiLifetime): Provision {
            return { keys, factory, lifetime };
        }

        export function merge(type: Class, base: Provision, override: Provision): Provision {
            return {
                keys: override.keys ?? base.keys ?? [type, type.name],
                factory: override.factory ?? base.factory ?? ((params) => new type(...params)),
                lifetime: override.lifetime ?? base.lifetime,
            };
        }
    }


    //
    // Dependency

    export interface Dependency {
        init: DiKey[];
        props?: { [key: string]: DiKey };
    }

    export namespace Dependency {
        export function independent(): Dependency {
            return { init: [], props: {} };
        }

        export function merge(base: Dependency, override: Dependency): Dependency {
            const idp = independent();
            return {
                init: override.init ?? base.init ?? idp.init,
                props: override.props ?? base.props ?? idp.props,
            };
        }
    }
}

export default DiConfig;
