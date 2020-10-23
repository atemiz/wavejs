import Wave from './wave';
export declare function decode(buffer: ArrayBufferLike): Wave;
export declare function encode(wave: Wave): ArrayBuffer;
declare const _default: {
    decode: typeof decode;
    encode: typeof encode;
};
export default _default;
