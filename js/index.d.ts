export * from './compile';
export * from './each';
export * from './config';
interface Options {
    helpers?: Record<string, Function>;
    fg?: any;
    bg?: any;
}
export declare function configure(opts?: Options): void;
