"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const wave_file_1 = __importDefault(require("./wave-file"));
let buffer = fs_1.default.readFileSync('./test.wav');
const wave = wave_file_1.default.decode(buffer);
wave.add(wave, 200);
fs_1.default.writeFileSync('./out.wav', Buffer.from(wave_file_1.default.encode(wave)));
