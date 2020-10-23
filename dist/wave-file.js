"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encode = exports.decode = void 0;
const dynamic_buffer_1 = __importDefault(require("./dynamic-buffer"));
const pcm_decoder_1 = __importDefault(require("./pcm-decoder"));
const pcm_encoder_1 = __importDefault(require("./pcm-encoder"));
const riff_file_1 = __importDefault(require("./riff-file"));
const wave_1 = __importDefault(require("./wave"));
function decode(buffer) {
    const dBuffer = new dynamic_buffer_1.default(buffer);
    const format = riff_file_1.default.decode(dBuffer);
    if (format !== 'WAVE')
        throw Error('Unsupported format.');
    const wave = new wave_1.default();
    while (dBuffer.offset < dBuffer.length) {
        const chunkId = dBuffer.readFourCC();
        const chunkSize = dBuffer.readU32();
        const beginOffset = dBuffer.offset;
        switch (chunkId) {
            case 'fmt ':
                wave.format = dBuffer.readU16();
                wave.channelCount = dBuffer.readU16();
                wave.sampleRate = dBuffer.readU32();
                dBuffer.readU32();
                dBuffer.readU16();
                wave.bitDepth = dBuffer.readU16();
                break;
            case 'data':
                const pcmDecoder = new pcm_decoder_1.default(wave.format, wave.channelCount, wave.sampleRate, wave.bitDepth);
                const sampleData = dBuffer.buffer.slice(beginOffset, beginOffset + chunkSize);
                wave.samples = pcmDecoder.decode(sampleData);
                break;
        }
        dBuffer.offset = beginOffset + chunkSize;
    }
    return wave;
}
exports.decode = decode;
function encode(wave) {
    const sampleCount = wave.samples[0].length * wave.channelCount;
    const dataChunkSize = sampleCount * (wave.bitDepth >> 3);
    const formatChunkSize = 16;
    const factChunkSize = 4;
    const waveChunkSize = dataChunkSize + formatChunkSize + factChunkSize + 8 + 8 + 8 + 4; // +4 for WAVE tag
    const fileSize = waveChunkSize;
    const dBuffer = new dynamic_buffer_1.default(fileSize + 8);
    const pcmEncoder = new pcm_encoder_1.default(wave.format, wave.channelCount, wave.sampleRate, wave.bitDepth);
    riff_file_1.default.encode(dBuffer, 'WAVE', waveChunkSize);
    dBuffer.writeFourCC('fmt ');
    dBuffer.writeU32(formatChunkSize);
    dBuffer.writeU16(wave.format);
    dBuffer.writeU16(wave.channelCount);
    dBuffer.writeU32(wave.sampleRate);
    dBuffer.writeU32(wave.sampleRate * wave.channelCount * (wave.bitDepth >> 3));
    dBuffer.writeU16(wave.channelCount * (wave.bitDepth >> 3));
    dBuffer.writeU16(wave.bitDepth);
    dBuffer.writeFourCC('fact');
    dBuffer.writeU32(4);
    dBuffer.writeU32(sampleCount);
    dBuffer.writeFourCC('data');
    dBuffer.writeU32(dataChunkSize);
    dBuffer.write(Buffer.from(pcmEncoder.encode(wave.samples)));
    return dBuffer.buffer;
}
exports.encode = encode;
exports.default = { decode, encode };
