import DynamicBuffer from './dynamic-buffer'

export enum AudioFormat {
  PCM = 0x0001,
  IEEE_Float = 0x0003
}

export default class Wave {
  format: AudioFormat
  channelCount: number
  sampleRate: number
  bitDepth: number

  private _samples!: DynamicBuffer[]

  get samples() {
    return this._samples.map(
      (channelData) => new Float32Array(channelData.buffer)
    )
  }

  set samples(value: Float32Array[]) {
    this._samples = value.map(
      (channelData) => new DynamicBuffer(channelData.buffer)
    )
  }

  constructor(
    format = AudioFormat.PCM,
    channelCount = 0,
    sampleRate = 44100,
    bitDepth = 16,
    samples = new Array<Float32Array>(1).fill(new Float32Array(0))
  ) {
    this.format = format
    this.channelCount = channelCount === 0 ? samples?.length ?? 1 : channelCount
    this.sampleRate = sampleRate
    this.bitDepth = bitDepth
    this.samples = samples
  }

  //Currently this works only with one channel
  add(wave: Wave, position: number) {
    const offset = Math.round(this.sampleRate * position * 0.001)
    const newSamples = wave.samples[0]
    
    this._samples[0].offset = offset * 4

    console.log(`offset: ${offset}`)

    for (let i = 0; i < newSamples.length; ++i) {
      this._samples[0].addF32(newSamples[i])
    }

    // console.log(`Offset: ${this._samples[0].offset} Buffer Length: ${this._samples[0].buffer.byteLength}
  }

  insert() {}

  overwrite(wave: Wave, position: number) {
    const startSample = Math.round(this.sampleRate * position * 0.001) * 4 // *4 for 32Bit

    this._samples[0].write(wave.samples[0].buffer, startSample)
  }
}
