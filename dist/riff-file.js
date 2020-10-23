"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encode = exports.decode = void 0;
function decode(buffer) {
    const chunkId = buffer.readFourCC();
    if (chunkId !== 'RIFF')
        throw Error('Unsupported container.');
    const chunkSize = buffer.readU32();
    const format = buffer.readFourCC();
    return format;
}
exports.decode = decode;
function encode(buffer, formatTag, chunkSize) {
    buffer.writeFourCC('RIFF');
    buffer.writeU32(chunkSize);
    buffer.writeFourCC(formatTag);
}
exports.encode = encode;
exports.default = { decode, encode };
