//
// sfx creation routines
//

export default class SoundFactory {
    constructor() {
        this._ctx = new AudioContext();
        this._isPrimed = false;
    }
    
    async initBuffers() {
        /** @type {AudioBuffer} */
        this._phBuf = await this._getBuf("audio/ph.wav");
    }
    
    /**
     * @param {string} localPath
     * @returns {Promise<AudioBuffer>}
     */
    async _getBuf(localPath) {
        const r = await fetch(localPath);
        const b = await r.arrayBuffer();
        const d = await this._ctx.decodeAudioData(b);

        return d;
    }

    /**
     * @param {AudioBuffer} b
     */
    _startBuf(b, loop = false) {

        const s = this._ctx.createBufferSource();
        
        s.buffer = b;
        s.loop = loop;
        s.connect(this._ctx.destination);
        s.start(this._ctx.currentTime);
        
        return s;
    }

    primeAudio() {
        if (!this._isPrimed) {
            this._ctx.resume();

            const s = this._ctx.createBufferSource();
            
            s.buffer = this._ctx.createBuffer(1, 1, this._ctx.sampleRate);
            s.connect(this._ctx.destination);
            s.start();

            this._isPrimed = true;
        }
    }
    
    stopAll() {
        this._ctx.close();
        this._ctx = new AudioContext();
    }
    
    playSound() {
        if (this._phBuf) {
            this._startBuf(this._phBuf);
        }
    }
}