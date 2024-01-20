(function(){
class Night {
    static make() {
        const base   = chroma('#000') // #000 
        const main   = chroma('#0d0') // red,orange,green,yellow,white  isHighlight
        const accent = chroma('#dd0') // red,orange,green,yellow,white  isHighlight
        return new ThemeColor(base, main, accent)
    }
}
class Noon {
    static make(isSoft=false) {
        const base   = chroma(((isSoft) ? '#ddd' : '#fff'))
        const main   = chroma('#000')
        const accent = chroma(((isSoft) ? '#0d0' : '#0f0')) // red,orange,yellow,green,blue * isSoft
        return new ThemeColor(base, main, accent)
    }
}
class ThemeColor {
    static get Night() { return Night }
    static get Noon() { return Noon }
    constructor(base, main, accent) {
        this._base = base
        this._main = main
        this._accent = accent
        this.#setColor()
    }
    get base( ) { return this._base }
    get main( ) { return this._main }
    get accent( ) { return this._accent }
    set base(v) { this._base = v }
    set main(v) { this._main = v }
    set accent(v) { this._accent = v }
    valid() {
        if (chroma.contrast(this.base, this.main  ) < 4.5) { return false }
        if (chroma.contrast(this.base, this.accent) < 4.5) { return false }
        if (chroma.contrast(this.main, this.accent) < 4.5) { return false }
        return true
    }
    #setColor() {
        Css.set('--background-color', this.base.hex())
        Css.set('--color', this.main.hex())
        Css.set('--em-color', this.main.hex())
        Css.set('--a-color', this.accent.hex())
        Css.set('--selection-color', this.base.hex())
        Css.set('--selection-background-color', this.main.hex())
        Css.set('--a-selection-color', this.base.hex())
        Css.set('--a-selection-background-color', this.accent.hex())
        Css.set('--caret-color', this.main.hex())
        Css.set('--outline-color', this.accent.hex())
        Css.set('--th-color', this.main.hex())
        Css.set('--th-background-color', chroma.mix(this.main, this.base, 0.75).hex())
//        Css.set('--button-focus-color', )
//        Css.set('--button-focus-background-color', )
    }
}
//window.themeColor = new ThemeColor()
window.ThemeColor = ThemeColor
//window.Night = ThemeColor
//window.Noon = ThemeColor
})()
