import fs from 'fs'
import WaveFile from './wave-file'

let buffer = fs.readFileSync('./test.wav')
const wave = WaveFile.decode(buffer)

wave.add(wave, 200)

fs.writeFileSync('./out.wav', Buffer.from(WaveFile.encode(wave)))
