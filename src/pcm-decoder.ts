import { AudioFormat } from './wave'

type DecoderFunction = (
  sampleData: ArrayBufferLike,
  offset?: number
) => Float32Array[]

type DecoderCollection = {
  [key: string]: DecoderFunction
}

export default class PCMDecoder {
  public readonly decode: DecoderFunction
  private format: AudioFormat
  private channelCount: number
  private sampleRate: number
  private bitDepth: number

  constructor(
    format: AudioFormat,
    channelCount: number,
    sampleRate: number,
    bitDepth: number
  ) {
    this.format = format
    this.channelCount = channelCount
    this.sampleRate = sampleRate
    this.bitDepth = bitDepth

    this.decode = this.decoders[
      `pcm${bitDepth}${format === AudioFormat.PCM ? '' : 'f'}`
    ]
  }

  private createOutputArray(sampleDataLength: number) {
    const output = new Array<Float32Array>(this.channelCount)
    const samplesPerChannel = Math.floor(sampleDataLength / this.channelCount)

    for (let cI = 0; cI < this.channelCount; ++cI)
      output[cI] = new Float32Array(samplesPerChannel)

    return output
  }

  private decoders: DecoderCollection = {
    pcm8: (sampleData: ArrayBufferLike, offset = 0) => {
      const output = this.createOutputArray(sampleData.byteLength)
      const input = new Uint8Array(sampleData)

      for (let sI = 0; sI < input.length; ++sI) {
        for (let cI = 0; cI < this.channelCount; ++cI) {
          const data = input[offset++] - 128
          output[cI][sI] = data < 0 ? data / 128 : data / 127
        }
      }

      return output
    },
    pcm16: (sampleData: ArrayBufferLike, offset = 0) => {
      const output = this.createOutputArray(sampleData.byteLength >> 1)
      const input = new Int16Array(sampleData)

      for (let sI = 0; sI < input.length; ++sI) {
        for (let cI = 0; cI < this.channelCount; ++cI) {
          let data = input[offset++]
          output[cI][sI] = data < 0 ? data / 32768 : data / 32767
        }
      }

      return output
    },
    pcm24: (sampleData: ArrayBufferLike, offset = 0) => {
      const output = this.createOutputArray(sampleData.byteLength / 3)
      let input = new Uint8Array(sampleData)

      for (let sI = 0; sI < input.length; ++sI) {
        for (let cI = 0; cI < this.channelCount; ++cI) {
          let x0 = input[offset++]
          let x1 = input[offset++]
          let x2 = input[offset++]
          let xx = x0 + (x1 << 8) + (x2 << 16)
          let data = xx > 0x800000 ? xx - 0x1000000 : xx
          output[cI][sI] = data < 0 ? data / 8388608 : data / 8388607
        }
      }

      return output
    },
    pcm32: (sampleData: ArrayBufferLike, offset = 0) => {
      const output = this.createOutputArray(sampleData.byteLength >> 2)
      let input = new Int32Array(sampleData)

      for (let sI = 0; sI < input.length; ++sI) {
        for (let cI = 0; cI < this.channelCount; ++cI) {
          let data = input[offset++]
          output[cI][sI] = data < 0 ? data / 2147483648 : data / 2147483647
        }
      }

      return output
    },
    pcm32f: (sampleData: ArrayBufferLike, offset = 0) => {
      const output = this.createOutputArray(sampleData.byteLength >> 2)
      let input = new Float32Array(sampleData)

      for (let sI = 0; sI < input.length; ++sI) {
        for (let cI = 0; cI < this.channelCount; ++cI)
          output[cI][sI] = input[offset++]
      }

      // console.log(JSON.stringify(input))

      return output
    },
    pcm64f: (sampleData: ArrayBufferLike, offset = 0) => {
      const output = this.createOutputArray(sampleData.byteLength >> 3)
      let input = new Float64Array(sampleData)

      for (let sI = 0; sI < input.length; ++sI) {
        for (let cI = 0; cI < this.channelCount; ++cI)
          output[cI][sI] = input[offset++]
      }

      return output
    }
  }
}
