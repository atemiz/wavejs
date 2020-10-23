"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wave = exports.WaveFile = void 0;
const wave_file_1 = __importDefault(require("./wave-file"));
exports.WaveFile = wave_file_1.default;
const wave_1 = __importDefault(require("./wave"));
exports.Wave = wave_1.default;
