enum DiLifetime  {
    Singleton = "Singleton",
    Scoped = "Scoped",
    Transient = "Transient",
}

namespace DiLifetime {
    const ValueMap: Map<DiLifetime, number> = new Map([
        [DiLifetime.Singleton, 2],
        [DiLifetime.Scoped, 1],
        [DiLifetime.Transient, 0],
    ]);

    export function valueOf(value: DiLifetime): number {
        return ValueMap.get(value);
    }
}


export default DiLifetime;
