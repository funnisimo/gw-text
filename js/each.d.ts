declare type EachFn = (ch: string, fg: any, bg: any, i: number, n: number) => void;
export declare function eachChar(text: string, fn: EachFn, fg?: any, bg?: any): void;
export {};
