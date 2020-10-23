import DynamicBuffer from './dynamic-buffer'

export function decode(buffer: DynamicBuffer) {
  const chunkId = buffer.readFourCC()
  if (chunkId !== 'RIFF') throw Error('Unsupported container.')
  const chunkSize = buffer.readU32()
  const format = buffer.readFourCC()
  return format
}

export function encode(
  buffer: DynamicBuffer,
  formatTag: string,
  chunkSize: number
) {
  buffer.writeFourCC('RIFF')
  buffer.writeU32(chunkSize)
  buffer.writeFourCC(formatTag)
}

export default { decode, encode }
