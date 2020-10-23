export declare enum AudioFormat {
    PCM = 1,
    IEEE_Float = 3
}
export default class Wave {
    format: AudioFormat;
    channelCount: number;
    sampleRate: number;
    bitDepth: number;
    private _samples;
    get samples(): Float32Array[];
    set samples(value: Float32Array[]);
    constructor(format?: AudioFormat, channelCount?: number, sampleRate?: number, bitDepth?: number, samples?: Float32Array[]);
    add(wave: Wave, position: number): void;
    insert(): void;
    overwrite(wave: Wave, position: number): void;
}
