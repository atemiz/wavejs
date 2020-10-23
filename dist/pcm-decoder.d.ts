import { AudioFormat } from './wave';
declare type DecoderFunction = (sampleData: ArrayBufferLike, offset?: number) => Float32Array[];
export default class PCMDecoder {
    readonly decode: DecoderFunction;
    private format;
    private channelCount;
    private sampleRate;
    private bitDepth;
    constructor(format: AudioFormat, channelCount: number, sampleRate: number, bitDepth: number);
    private createOutputArray;
    private decoders;
}
export {};
