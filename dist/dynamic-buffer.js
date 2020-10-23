"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DynamicBuffer {
    constructor(param) {
        this._growSize = 4194304; // 4MB
        if (typeof param === 'number') {
            this._buffer = new ArrayBuffer(param);
            this._length = param;
        }
        else if (typeof param !== 'undefined') {
            //if param is a NodeJS Buffer get underlying ArrayBuffer
            if (param instanceof Buffer) {
                this._buffer = new Uint8Array(param.buffer, param.byteOffset, param.length).buffer;
                this._length = param.length;
            }
            else {
                this._buffer = param;
                this._length = param.byteLength;
            }
        }
        else {
            this._buffer = new ArrayBuffer(this._growSize);
            this._length = this._growSize;
        }
        this._view = new DataView(this._buffer);
        this._offset = 0;
    }
    get buffer() {
        return this._buffer.slice(0, this._length);
    }
    get offset() {
        return this._offset;
    }
    set offset(value) {
        this._offset = value;
        if (value > this._length)
            this._length = value;
    }
    get length() {
        return this._length;
    }
    set length(value) {
        const difference = value - this._buffer.byteLength;
        if (difference < 0) {
            this._buffer = this._buffer.slice(0, value);
        }
        else {
            this.ensureSize(difference);
        }
        this._length = value;
    }
    grow(amount) {
        if (amount < 1)
            return;
        // console.log('Array resized to: ' + this._buffer.byteLength + amount)
        const newBuffer = new ArrayBuffer(this._buffer.byteLength + amount);
        const view = new Uint8Array(newBuffer);
        view.set(new Uint8Array(this._buffer));
        this._buffer = newBuffer;
        this._view = new DataView(this._buffer);
    }
    ensureSize(size, offset = this._buffer.byteLength) {
        if (size + offset > this._buffer.byteLength)
            this.grow((size + offset) * 2);
    }
    write(buffer, offset = this._offset) {
        this.ensureSize(buffer.byteLength, offset);
        // console.log(
        //   `Array length: ${this._buffer.byteLength} New Array Length: ${buffer.byteLength} Offset: ${offset}`
        // )
        const view = new Uint8Array(this._buffer);
        view.set(new Uint8Array(buffer), offset);
        this.offset = offset + buffer.byteLength;
    }
    readFourCC(offset = this._offset) {
        let value = '';
        for (let i = 0; i < 4; ++i)
            value += String.fromCharCode(this._view.getUint8(offset + i));
        this._offset = offset + 4;
        return value;
    }
    writeFourCC(value, offset = this._offset) {
        this.ensureSize(4, offset);
        for (let i = 0; i < 4; ++i)
            this._view.setUint8(offset + i, value.charCodeAt(i));
        this.offset = offset + 4;
    }
    readU16(offset = this._offset) {
        const value = this._view.getUint16(offset, true);
        this._offset = offset + 2;
        return value;
    }
    writeU16(value, offset = this._offset) {
        this.ensureSize(2, offset);
        this._view.setUint16(offset, value, true);
        this.offset = offset + 2;
    }
    readU32(offset = this._offset) {
        const value = this._view.getUint32(offset, true);
        this._offset = offset + 4;
        return value;
    }
    writeU32(value, offset = this._offset) {
        this.ensureSize(4, offset);
        this._view.setUint32(offset, value, true);
        this.offset = offset + 4;
    }
    readF32(offset = this._offset) {
        const value = this._view.getFloat32(offset, true);
        this._offset = offset + 4;
        return value;
    }
    writeF32(value, offset = this._offset) {
        this.ensureSize(4, offset);
        this._view.setFloat32(offset, value, true);
        this.offset = offset + 4;
    }
    addF32(value, offset = this._offset) {
        this.ensureSize(4, offset);
        const newValue = this._view.getFloat32(offset, true) + value;
        this._view.setFloat32(offset, newValue, true);
        this.offset = offset + 4;
    }
}
exports.default = DynamicBuffer;
