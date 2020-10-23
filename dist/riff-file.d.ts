import DynamicBuffer from './dynamic-buffer';
export declare function decode(buffer: DynamicBuffer): string;
export declare function encode(buffer: DynamicBuffer, formatTag: string, chunkSize: number): void;
declare const _default: {
    decode: typeof decode;
    encode: typeof encode;
};
export default _default;
