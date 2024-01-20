(function(){
class Client {
    constructor(w, h) {
        this.width = (w) ? w : document.documentElement.clientWidth
        this.height = (h) ? h : document.documentElement.clientHeight
        this.ratio = new AspectRatio(this.width, this.height)
    }
//    get inline() { return this.width }
//    get block() { return this.height }
//    set inline(v) { this.width = v }
//    set block(v) { this.height = v }
//    get long() { return (this.height <= this.width) ? ['width', this.width] : ['height', this.height] }
//    get short() { return (this.height <= this.width) ? ['height', this.height] : ['width', this.width] }
    get long() { return (this.height <= this.width) ? {dir:'width', size:this.width} : {dir:'height', size:this.height} }
    //get short() { return (this.height <= this.width) ? ({dir:'height', size:this.height}) : ({dir:'width', size:this.width}) }
    get short() { return (this.height <= this.width) ? {dir:'height', size:this.height} : {dir:'width', size:this.width} }
    get isLandscape() { return 'width'===this.long.dir }
    get isPortrate() { return 'height'===this.long.dir }
}
class AspectRatio {
    constructor(w, h) {
        this.width = (w) ? w : document.documentElement.clientWidth
        this.height = (h) ? h : document.documentElement.clientHeight
    }
    get ratio() { // アスペクト比
        const gcd = this.#gcd(this.width, this.height)
        return ((1 === gcd) ? this.aspectRatioShort1 : {width:Math.floor(this.width / gcd), height: Math.floor(this.height / gcd)})
    }
    get short1Long() { // 短辺１時の長辺比 {width:N, height:N}
        const l = this.long
        const s = this.short
        const o = {}
        o[s.dir] = 1
        o[l.dir] = l.size / s.size
        return o
    }
    get long() { const [l, s] = [this.long, this.short]; return ({dir:l.dir, size:l.size, ratio:(l.size/s.size)}); }
    get longSize() { return this.long.size / this.short.size } // 短辺１時の長辺比
    #gcd(a, b){ // 最大公約数
        if(b == 0) return a;
        return gcd(b, a % b);
    }
}
class WritingMode {
    constructor(writingMode) {
//        console.log(writingMode)
//        console.log(((writingMode) ? writingMode : WritingMode.horizontalValue))
        this.#setDefault(writingMode)
//        this._writingMode = ((writingMode) ? writingMode : WritingMode.horizontalValue)
//        this._writingMode = this.isHorizontal(((writingMode) ? writingMode : WritingMode.horizontalValue))
//        console.log(this._writingMode)
    }
    get isVertical() { return this._writingMode.startsWith('vertical') }
    get isHorizontal() { return this._writingMode.startsWith('horizontal') }
    set isVertical(v) { this._writingMode = ((v) ? 'vertical-rl' : 'horizontal-tb') }
    set isHorizontal(v) { this._writingMode = ((v) ? 'horizontal-tb' : 'vertical-rl') }
    get value() { return this._writingMode }
    get reverseValue() { return ((this.isVertical) ? 'horizontal-tb' : 'vertical-rl') }
    static get verticalValue() { return 'vertical-rl' }
    static get horizontalValue() { return 'horizontal-tb' }
    static Vertical() { return new WritingMode('vertical-rl') }
    static Horizontal() { return new WritingMode('horizontal-tb') }
    #setDefault(v) {
        if      (v===WritingMode.verticalValue)   { this._writingMode = v }
        else if (v===WritingMode.horizontalValue) { this._writingMode = v }
        else                                      { this._writingMode = WritingMode.horizontalValue }
    }
}
class Layout {
    constructor(client, writingMode, hasMenu) {
        this._client = client
        this._writingMode = writingMode
        this._fontSize = new FontSize(((this._writingMode.isHorizontal) ? this._client.width : this._client.height))
        this.count = this.#count()
        this.menu = new Menu(this._fontSize, client)
        this.ui = { width:0, height:0 }
        this.grid = { columns:null, rows:null }
    }
    #count() { return ((18 < this._fontSize.size) ? 2 : 1) }
    #gridTemplate() {
        this.menuBlockSize.val = this.menu.size.block
        this.ui.width.val = (this._client.isLandscape) ? ((this._client.width.val - this.menu.size.block.val) / 2) : this._client.width.val
        this.ui.height.val = (this._client.isLandscape) ? this._client.height.val : ((this._client.height.val - this.menu.size.block.val) / 2)
        const landscapeSizes = [`${this.ui.width.val}px ${this.menu.size.block.val}px ${this.ui.width.val}px`, `${this.ui.height.val}px`]
        const portraitSizes = [`${this.ui.width.val}px`, `${this.ui.height.val}px ${this.menu.size.block.val}px ${this.ui.height.val}px`]
        const sizes = (this._client.isLandscape) ? landscapeSizes : portraitSizes
//        this.gridTemplateColumns.val = sizes[0]
//        this.gridTemplateRows.val = sizes[1]
        this.grid.columns.val = sizes[0]
        this.grid.rows.val = sizes[1]
        this._fontSize.size = this._fontSize.calc(((this._writingMode.isVertical) ? this._client.height : this._client.width))
        this.men.fontSize.size = this._fontSize.size
//        this.menu.isVertical = this.#isLandscape()
//        this.#fontSize()
        /*
//        this.menuBlockSize.val = this.menu.blockSize * 1.5
        this.uiWidth.val = (this.#isLandscape()) ? ((this.width.val - this.menuBlockSize.val) / 2) : this.width.val
        this.uiHeight.val = (this.#isLandscape()) ? this.height.val : ((this.height.val - this.menuBlockSize.val) / 2)
        const landscapeSizes = [`${this.uiWidth.val}px ${this.menuBlockSize.val}px ${this.uiWidth.val}px`, `${this.uiHeight.val}px`]
        const portraitSizes = [`${this.uiWidth.val}px`, `${this.uiHeight.val}px ${this.menuBlockSize.val}px ${this.uiHeight.val}px`]
        const sizes = (this.#isLandscape()) ? landscapeSizes : portraitSizes
        this.gridTemplateColumns.val = sizes[0]
        this.gridTemplateRows.val = sizes[1]
        this.menu.isVertical = this.#isLandscape()
        this.#fontSize()
        */
    }
    style() { return `display:grid;grid-template-columns:${this.gridTemplateColumns.val};grid-template-rows:${this.gridTemplateRows.val};inline-size:${this.inlineSize.val};block-size:${this.blockSize.val};` }
}
class Menu {
    constructor(client, fontSize) {
        this._client = client
        this._writingMode = new WritingMode((this._client.isLandscape) ? 'vertical' : 'horizontal')
        this._fontSize = fontSize
        this.size = {
            inline: ((this._client.isLandscape) ? this._client.height : this._client.width),
            block: ((this._client.isLandscape) ? this._client.width : this._client.height),
        }
    }
}
class Font {
    constructor(inlineSize, serif, sunSerif) {
        this.size = new FontSize(inlineSize)
        this.famiry = new FontFamily(serif, sunSerif)
    }
}
class FontSize {
    constructor(inlineSize) {
        this.size = this.calc(inlineSize)
    }
    calc(inlineSize) {
//        const minLineChars = inlineSize / 16
        const minLineChars = FontSize.calcLineOfCharMax(inlineSize)
        if (minLineChars <= 30) { return 16; } // Screen<=480px: 16px/1字 1〜30字/行
        else if (minLineChars <= 40) { return 18; } // Screen<=640px: 18px/1字 26.6〜35.5字/行
        else { return (inlineSize / 40); } // Screen<=640px: ?px/1字 40字/行
    }
    setProp() { Css.set('--font-size', `${this.size}px`) }
    setBody() { Css.set('font-size', `${this.size}px`, document.body) }
    static get min() { return 16 }
    static calcLineOfCharMax(inlineSize) { return inlineSize / this.min }
    static calcLineOfChar(inlineSize, fontSize) { return inlineSize / fontSize }
}
class FontFamily {
    constructor(serif, sunsSerif) {
        this.serif = (serif) ? serif : `'Noto Serif JP', 'Source Han Serif JP', 'Noto Color Emoji', serif`
        this.sunsSerif = (sunsSerif) ? sunsSerif : `'Noto Sans JP', 'Source Han Sans JP', 'Noto Color Emoji', sans-serif`
    }
    setProp() {
        Css.set('--font-family-serif', `${this.serif}`)
        Css.set('--font-family-suns-serif', `${this.sunsSerif}`)
    }
}
/*
class AppStyle {
    constructor() {
        this.size = {
            width: van.state(document.documentElement.clientWidth),
            height: van.state(document.documentElement.clientHeight),
            inline: van.state(document.documentElement.clientWidth),
            block: van.state(document.documentElement.clientHeight),
            long: van.derive(()=>(this.height.val <= this.width.val) ? this.width.val : this.height.val),
            short: van.derive(()=>(this.height.val <= this.width.val) ? this.width.val : this.height.val),
            isLandscape: 0,
            isPortrate: 0,
        }
        this.menu = {
            size: {

            }
        }
        this.ui = {
            sise: {
                width: van.state(this.size.width.val),
                height: van.state(((this.size.height.val - this.menuBlockSize.val) / 2)),
            }
        }
        this.width = van.state(document.documentElement.clientWidth)
        this.height = van.state(document.documentElement.clientHeight)
        this.blockSize = van.state(document.documentElement.clientHeight)
        this.inlineSize = van.state(document.documentElement.clientWidth)
        this.longSize = van.derive(()=>(this.height.val <= this.width.val) ? this.width.val : this.height.val)
        this.shortSize = van.derive(()=>(this.height.val <= this.width.val) ? this.width.val : this.height.val)
        this.longDir = van.derive(()=>(this.height.val <= this.width.val) ? '横長' : '縦長')
        this.menuBlockSize = van.state(32)
//        alert(Css.get('--font-size'))
//        alert(Css.get('font-size', document.body))
        //this.menuBlockSize = van.state(Css.getFloat('--font-size'))
        this.uiWidth = van.state(this.width.val)
        this.uiHeight = van.state(((this.height.val - this.menuBlockSize.val) / 2))
        this.gridTemplateColumns = van.state(`${this.uiWidth.val}px ${this.menuBlockSize.val}px ${this.uiWidth.val}px`)
        this.gridTemplateRows = van.state(`${this.uiHeight.val}px`)
    }
    setup(menu) {
        this.menu = menu
        this.#resize()
        new ResizeObserver(entries=>{
            for (let entry of entries) { this.#resize(entry.contentRect.width, entry.contentRect.height) }
        }).observe(document.querySelector('body'));
        document.querySelector(':root').style.setProperty('--block-size', `${this.blockSize.val}px`)
        document.querySelector(':root').style.setProperty('--inline-size', `${this.inlineSize.val}px`)
    }
    style() { return `display:grid;grid-template-columns:${this.gridTemplateColumns.val};grid-template-rows:${this.gridTemplateRows.val};inline-size:${this.inlineSize.val};block-size:${this.blockSize.val};` }
    #resize(W=0, H=0) {
        if (0===W) { W = document.documentElement.clientWidth }
        if (0===H) { H = document.documentElement.clientHeight }
        if (this.width.val !== W) { this.width.val = W }
        if (this.height.val !== H) { this.height.val = H }
        this.#gridTemplate()
        this.inlineSize.val = W
        this.blockSize.val = H
    }
    #isLandscape() { return ('横長'===this.longDir.val) }
    #isPortrait() { return ('縦長'===this.longDir.val) }
    #gridTemplate() {
        this.menuBlockSize.val = this.menu.blockSize
//        this.menuBlockSize.val = this.menu.blockSize * 1.5
        this.uiWidth.val = (this.#isLandscape()) ? ((this.width.val - this.menuBlockSize.val) / 2) : this.width.val
        this.uiHeight.val = (this.#isLandscape()) ? this.height.val : ((this.height.val - this.menuBlockSize.val) / 2)
        const landscapeSizes = [`${this.uiWidth.val}px ${this.menuBlockSize.val}px ${this.uiWidth.val}px`, `${this.uiHeight.val}px`]
        const portraitSizes = [`${this.uiWidth.val}px`, `${this.uiHeight.val}px ${this.menuBlockSize.val}px ${this.uiHeight.val}px`]
        const sizes = (this.#isLandscape()) ? landscapeSizes : portraitSizes
        this.gridTemplateColumns.val = sizes[0]
        this.gridTemplateRows.val = sizes[1]
        this.menu.isVertical = this.#isLandscape()
        this.#fontSize()
    }
    #fontSize() {
        const minLineChars = this.uiWidth.val / 16
        if (minLineChars <= 30) { Css.set('--font-size', '16px'); return; } // Screen<=480px: 16px/1字 1〜30字/行
        else if (minLineChars <= 40) { Css.set('--font-size', '18px'); return; } // Screen<=640px: 18px/1字 26.6〜35.5字/行
        else { Css.set('--font-size', `${this.uiWidth.val / 40}px`); return; } // Screen<=640px: ?px/1字 40字/行
    }
}
window.appStyle = new AppStyle()
*/
window.Layout = Layout
window.Client = Client
window.WritingMode = WritingMode
window.FontFamily = FontFamily
})()
