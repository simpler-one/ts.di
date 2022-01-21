interface DiContainerConfig {
    allowInheritanceResolution?: boolean,
    throwOnIllegalLayerAccess?: boolean,
}

namespace DiContainerConfig {
    export function ofDefault(): DiContainerConfig {
        return  {
            allowInheritanceResolution: true,
            throwOnIllegalLayerAccess: false,
        };
    }

    export function defaultFilled(config: DiContainerConfig): DiContainerConfig {
        return { ...ofDefault(), ...config };
    }
}

export default DiContainerConfig;
