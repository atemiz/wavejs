export default class DynamicBuffer {
    private _buffer;
    private readonly _growSize;
    private _offset;
    private _length;
    private _view;
    constructor();
    constructor(size: number);
    constructor(buffer: ArrayBufferLike);
    get buffer(): ArrayBuffer;
    get offset(): number;
    set offset(value: number);
    get length(): number;
    set length(value: number);
    grow(amount: number): void;
    ensureSize(size: number, offset?: number): void;
    write(buffer: ArrayBufferLike, offset?: number): void;
    readFourCC(offset?: number): string;
    writeFourCC(value: string, offset?: number): void;
    readU16(offset?: number): number;
    writeU16(value: number, offset?: number): void;
    readU32(offset?: number): number;
    writeU32(value: number, offset?: number): void;
    readF32(offset?: number): number;
    writeF32(value: number, offset?: number): void;
    addF32(value: number, offset?: number): void;
}
