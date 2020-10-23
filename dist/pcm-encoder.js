"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wave_1 = require("./wave");
class PCMEncoder {
    constructor(format, channelCount, sampleRate, bitDepth) {
        this.encoders = {
            pcm8: (sampleData) => {
                const output = this.createOutputArray(sampleData[0].length);
                const view = new Uint8Array(output);
                let offset = 0;
                for (let sI = 0; sI < sampleData[0].length; ++sI) {
                    for (let cI = 0; cI < this.channelCount; ++cI) {
                        let data = Math.max(-1, Math.min(sampleData[cI][sI], 1));
                        data = ((data * 0.5 + 0.5) * 255) | 0;
                        view[offset++] = data;
                    }
                }
                return output;
            },
            pcm16: (sampleData) => {
                const output = this.createOutputArray(sampleData[0].length);
                const view = new Int16Array(output);
                let offset = 0;
                for (let sI = 0; sI < sampleData[0].length; ++sI) {
                    for (let cI = 0; cI < this.channelCount; ++cI) {
                        let v = Math.max(-1, Math.min(sampleData[cI][sI], 1));
                        v = (v < 0 ? v * 32768 : v * 32767) | 0;
                        view[offset++] = v;
                    }
                }
                return output;
            },
            pcm24: (sampleData) => {
                const output = this.createOutputArray(sampleData[0].length);
                const view = new Uint8Array(output);
                let offset = 0;
                for (let sI = 0; sI < sampleData[0].length; ++sI) {
                    for (let cI = 0; cI < this.channelCount; ++cI) {
                        let v = Math.max(-1, Math.min(sampleData[cI][sI], 1));
                        v = (v < 0 ? 0x1000000 + v * 8388608 : v * 8388607) | 0;
                        view[offset++] = (v >> 0) & 0xff;
                        view[offset++] = (v >> 8) & 0xff;
                        view[offset++] = (v >> 16) & 0xff;
                    }
                }
                return output;
            },
            pcm32: (sampleData) => {
                const output = this.createOutputArray(sampleData[0].length);
                const view = new Int32Array(output);
                let offset = 0;
                for (let sI = 0; sI < sampleData[0].length; ++sI) {
                    for (let cI = 0; cI < this.channelCount; ++cI) {
                        let v = Math.max(-1, Math.min(sampleData[cI][sI], 1));
                        v = (v < 0 ? v * 2147483648 : v * 2147483647) | 0;
                        view[offset++] = v;
                    }
                }
                return output;
            },
            pcm32f: (sampleData) => {
                const output = this.createOutputArray(sampleData[0].length);
                const view = new Float32Array(output);
                let offset = 0;
                for (let sI = 0; sI < sampleData[0].length; ++sI) {
                    for (let cI = 0; cI < this.channelCount; ++cI) {
                        let v = Math.max(-1, Math.min(sampleData[cI][sI], 1));
                        view[offset++] = v;
                    }
                }
                return output;
            },
            pcm64f: (sampleData) => {
                const output = this.createOutputArray(sampleData[0].length);
                const view = new Float64Array(output);
                let offset = 0;
                for (let sI = 0; sI < sampleData[0].length; ++sI) {
                    for (let cI = 0; cI < this.channelCount; ++cI) {
                        let v = Math.max(-1, Math.min(sampleData[cI][sI], 1));
                        view[offset++] = v;
                    }
                }
                return output;
            }
        };
        this.format = format;
        this.channelCount = channelCount;
        this.sampleRate = sampleRate;
        this.bitDepth = bitDepth;
        this.encode = this.encoders[`pcm${bitDepth}${format === wave_1.AudioFormat.PCM ? '' : 'f'}`];
    }
    createOutputArray(sampleDataLength) {
        return new ArrayBuffer(this.channelCount * sampleDataLength * (this.bitDepth >> 3));
    }
}
exports.default = PCMEncoder;
