export const extend = <T extends unknown> (a: unknown, b: unknown): T => Object.assign({} as T, a, b);

export const uniqueId = (): number => Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));