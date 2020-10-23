import { AudioFormat } from './wave';
declare type EncoderFunction = (sampleData: Float32Array[]) => ArrayBuffer;
export default class PCMEncoder {
    readonly encode: EncoderFunction;
    private format;
    private channelCount;
    private sampleRate;
    private bitDepth;
    constructor(format: AudioFormat, channelCount: number, sampleRate: number, bitDepth: number);
    private createOutputArray;
    private encoders;
}
export {};
