import DynamicBuffer from './dynamic-buffer'
import PCMDecoder from './pcm-decoder'
import PCMEncoder from './pcm-encoder'
import RIFFFile from './riff-file'
import Wave from './wave'

export function decode(buffer: ArrayBufferLike) {
  const dBuffer = new DynamicBuffer(buffer)
  const format = RIFFFile.decode(dBuffer)

  if (format !== 'WAVE') throw Error('Unsupported format.')

  const wave = new Wave()

  while (dBuffer.offset < dBuffer.length) {
    const chunkId = dBuffer.readFourCC()
    const chunkSize = dBuffer.readU32()
    const beginOffset = dBuffer.offset

    switch (chunkId) {
      case 'fmt ':
        wave.format = dBuffer.readU16()
        wave.channelCount = dBuffer.readU16()
        wave.sampleRate = dBuffer.readU32()
        dBuffer.readU32()
        dBuffer.readU16()
        wave.bitDepth = dBuffer.readU16()
        break
      case 'data':
        const pcmDecoder = new PCMDecoder(
          wave.format,
          wave.channelCount,
          wave.sampleRate,
          wave.bitDepth
        )

        const sampleData = dBuffer.buffer.slice(
          beginOffset,
          beginOffset + chunkSize
        )

        wave.samples = pcmDecoder.decode(sampleData)
        break
    }
    dBuffer.offset = beginOffset + chunkSize
  }
  return wave
}

export function encode(wave: Wave) {
  const sampleCount = wave.samples[0].length * wave.channelCount
  const dataChunkSize = sampleCount * (wave.bitDepth >> 3)
  const formatChunkSize = 16
  const factChunkSize = 4
  const waveChunkSize =
    dataChunkSize + formatChunkSize + factChunkSize + 8 + 8 + 8 + 4 // +4 for WAVE tag
  const fileSize = waveChunkSize
  const dBuffer = new DynamicBuffer(fileSize + 8)

  const pcmEncoder = new PCMEncoder(
    wave.format,
    wave.channelCount,
    wave.sampleRate,
    wave.bitDepth
  )

  RIFFFile.encode(dBuffer, 'WAVE', waveChunkSize)

  dBuffer.writeFourCC('fmt ')
  dBuffer.writeU32(formatChunkSize)
  dBuffer.writeU16(wave.format)
  dBuffer.writeU16(wave.channelCount)
  dBuffer.writeU32(wave.sampleRate)
  dBuffer.writeU32(wave.sampleRate * wave.channelCount * (wave.bitDepth >> 3))
  dBuffer.writeU16(wave.channelCount * (wave.bitDepth >> 3))
  dBuffer.writeU16(wave.bitDepth)

  dBuffer.writeFourCC('fact')
  dBuffer.writeU32(4)
  dBuffer.writeU32(sampleCount)

  dBuffer.writeFourCC('data')
  dBuffer.writeU32(dataChunkSize)
  dBuffer.write(Buffer.from(pcmEncoder.encode(wave.samples)))

  return dBuffer.buffer
}

export default { decode, encode }
