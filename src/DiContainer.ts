import DiKey from "./DiKey";
import DiConfig from "./DiConfig";
import Class from "./Class";
import DiContainerConfig from "./DiContainerConfig";
import DiLifetime from "./DiLifetime";
import DiDefiner from "./DiDefiner";


export default class DiContainer {
    private readonly configTable: Map<DiKey, DiConfig>;

    private readonly singletonInstances: Map<DiKey, any>;
    private readonly scopedInstances: Map<DiKey, any>;

    public constructor(
        private readonly config: DiContainerConfig = undefined,
    ) {
        this.config = DiContainerConfig.defaultFilled(config);
        this.singletonInstances = new Map();
        this.scopedInstances = new Map();
    }

    public bind(type: Class, provisionConfig?: DiConfig.Provision): void;
    public bind(config: DiConfig): void;
    public bind(typeOrConfig: Class | DiConfig, provisionConfig?: DiConfig.Provision): void {
        if (typeOrConfig instanceof Function) {
            this.bindClass(typeOrConfig, provisionConfig);
        } else {
            this.bindConfig(typeOrConfig);
        }
    }


    public getInstance<T= any>(key: DiKey): T {
        return this.singletonInstances.get(key) ?? this.scopedInstances.get(key)
    }

    public resolve<T = any>(key: DiKey): T {
        return this._resolve(key, []);
    }

    public resolveAll(targetLevel: DiLifetime = DiLifetime.Singleton): void {
        const tgtLv = DiLifetime.valueOf(targetLevel);

        for (const config of this.configTable.values()) {
            if (tgtLv <= DiLifetime.valueOf(config.provision.lifetime)) {
                this.resolve(config.provision.keys[0]);
            }
        }
    }

    public newScope(): DiContainer {
        const newContainer = new DiContainer(this.config);
        // TODO
        return newContainer;
    }

    private bindConfig(config: DiConfig): void {
        config = {
            provision: config.provision,
            dependency: config.dependency ?? DiConfig.Dependency.independent(),
        };

        if (!DiConfig.Provision.validate(config.provision)) {
            throw new Error(`[InvalidConfig] Provision config is invalid. keys: ${config.provision?.keys?.map(DiKey.stringify)?.join(",")}`);
        }
        for (const k of config.provision.keys.filter(n => this.configTable.has(n))) {
            throw new Error(`[Conflict] Key is already used. key: ${DiKey.stringify(k)}`);
        }

        for (const k of config.provision.keys) {
            this.configTable.set(k, config);
        }
    }

    private bindClass(type: Class, provisionConfig: DiConfig.Provision | undefined): void {
        const definition = DiDefiner.get(type);
        const config = DiConfig.merge(type, definition, { provision: provisionConfig });

        if (!DiConfig.Provision.validate(config.provision)) {
            throw new Error(`[InvalidConfig] Provision config is invalid. class: ${type.name}`);
        }
        for (const k of definition.provision.keys.filter(n => this.configTable.has(n))) {
            throw new Error(`[Conflict] Key is already used. key: ${DiKey.stringify(k)}, class: ${type.name}`);
        }

        this.configTable.set(type, config);
        for (const k of config.provision.keys) {
            this.configTable.set(k, config);
        }
    }

    private getConfig(key: DiKey): DiConfig {
        const found = this.configTable.get(key);
        if (found || !this.config.allowInheritanceResolution) {
            return found;
        }

        // TODO: inheritance resolution
    }

    private _resolve(key: DiKey, creating: DiKey[]): any {
        const foundConfig = this.getConfig(key);
        if (!foundConfig) {
            return undefined;
        }

        const instance = this.getInstance(key);
        if (instance) {
            return instance;
        }

        if (creating.includes(key)) {
            throw new Error("[Loop] Circular dependency detected while dependency resolution.\n" + creating.map(DiKey.stringify).join(" -> \n"));
        }

        return this.create(key, foundConfig, creating);
    }

    private create(key: DiKey, config: DiConfig, creating: DiKey[]): any {
        creating.push(key);

        const initDependencies = config.dependency.init.map(key => this.resolve(key));
        const instance = config.provision.factory(...initDependencies);

        let map: Map<DiKey, any>;
        if (config.provision.lifetime === DiLifetime.Singleton) {
            map = this.singletonInstances;
        } else if (config.provision.lifetime === DiLifetime.Scoped) {
            map = this.scopedInstances;
        } else {
            map = new Map(); // TODO: dummy
        }

        for (const k of config.provision.keys) {
            map.set(k, instance);
        }

        creating.pop();
    }
}
