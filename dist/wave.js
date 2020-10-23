"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioFormat = void 0;
const dynamic_buffer_1 = __importDefault(require("./dynamic-buffer"));
var AudioFormat;
(function (AudioFormat) {
    AudioFormat[AudioFormat["PCM"] = 1] = "PCM";
    AudioFormat[AudioFormat["IEEE_Float"] = 3] = "IEEE_Float";
})(AudioFormat = exports.AudioFormat || (exports.AudioFormat = {}));
class Wave {
    constructor(format = AudioFormat.PCM, channelCount = 0, sampleRate = 44100, bitDepth = 16, samples = new Array(1).fill(new Float32Array(0))) {
        var _a;
        this.format = format;
        this.channelCount = channelCount === 0 ? (_a = samples === null || samples === void 0 ? void 0 : samples.length) !== null && _a !== void 0 ? _a : 1 : channelCount;
        this.sampleRate = sampleRate;
        this.bitDepth = bitDepth;
        this.samples = samples;
    }
    get samples() {
        return this._samples.map((channelData) => new Float32Array(channelData.buffer));
    }
    set samples(value) {
        this._samples = value.map((channelData) => new dynamic_buffer_1.default(channelData.buffer));
    }
    //Currently this works only with one channel
    add(wave, position) {
        const offset = Math.round(this.sampleRate * position * 0.001);
        const newSamples = wave.samples[0];
        this._samples[0].offset = offset * 4;
        console.log(`offset: ${offset}`);
        for (let i = 0; i < newSamples.length; ++i) {
            this._samples[0].addF32(newSamples[i]);
        }
        // console.log(`Offset: ${this._samples[0].offset} Buffer Length: ${this._samples[0].buffer.byteLength}
    }
    insert() { }
    overwrite(wave, position) {
        const startSample = Math.round(this.sampleRate * position * 0.001) * 4; // *4 for 32Bit
        this._samples[0].write(wave.samples[0].buffer, startSample);
    }
}
exports.default = Wave;
