declare type EachFn = (ch: string, i: number, fg: any, bg: any) => void;
export declare function eachChar(text: string, fn: EachFn, fg?: any, bg?: any): void;
export {};
