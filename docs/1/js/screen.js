(function(){
const {div,h1,p,button} = van.tags
class SingleScreen {
    constructor() {
        this._children = van.state([])
        this._w = van.state('100%')
        this._h = van.state('100%')
        this._writingMode = van.state('horizontal-tb') // vertical-rl
        this._overflowX = van.state('auto')
        this._overflowY = van.state('auto')
        this._textOrient = van.state('mixed') // upright
        this._border = van.state('solid 1px #000')
        this._wordBreak = van.state('normal')
        this._div = van.tags.div({onwheel:(e)=>this.#onWheel(e), style:()=>`padding:0;margin:0;overflow-y:scroll;width:${this._w.val};height:${this._h.val};box-sizing:border-box;border:${this._border.val};background-color:#ccc;writing-mode:${this._writingMode.val};overflow-x:${this._overflowX.val};overflow-y:${this._overflowY.val};text-orientation:${this._textOrient.val};word-break:${this._wordBreak.val};`}, ()=>div(this.children))
    }
    get el() { return this._div }
    get children( ) { return this._children.val }
    set children(v) { this._children.val = v}
    get isVertical() { return !this.isHorizontal }
    get isHorizontal() { return ('horizontal-tb'===this._writingMode.val) }
    set isVertical(v) { if(v) { this._writingMode = 'vertical-rl' }  }
    set isHorizontal(v) { if(v) { this._writingMode = 'horizontal-tb' }  }
    toggleWritingMode() {
        this._writingMode.val = (('horizontal-tb'===this._writingMode.val) ? 'vertical-rl' : 'horizontal-tb')
        this.#setOverflow()
    }
    #setOverflow() {
        if ('horizontal-tb'===this._writingMode.val) {
            this._overflowX.val = 'hidden'
            this._overflowY.val = 'auto'
            this._textOrient.val = 'mixed'
        } else {
            this._overflowX.val = 'auto'
            this._overflowY.val = 'hidden'
            this._textOrient.val = 'upright'
        }
    }
    set wordBreak(val) { if (['normal','break-all','keep-all','break-word'].some(v=>v===val)) { this._wordBreak.val = val } }
    get hasScrollBar() { return ((this.el.isHorizontal) ? this.el.scrollHeight > this.el.this.height : this.el.scrollWidth > this.el.this.width) }
    get scrollSize() { return ((this.el.isHorizontal) ? this.el.offsetHeight - this.el.clientHeight : this.el.offsetWidth - this.el.clientWidth) }
    #onWheel(e) {
        if ('vertical-rl'===this._writingMode.val) {
            if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
            this._div.scrollLeft += e.deltaY;
            e.preventDefault();
        }
    }
}
class DoubleScreen {
    constructor() {
        this._left = new SingleScreen()
        this._right = new SingleScreen()
//        this._blockSize = van.state(document.body.clientHeight)
//        this._writingMode = van.state('horizontal-tb') // vertical-rl
//        this._overflowX = van.state('auto')
//        this._overflowY = van.state('auto')
//        this._textOrient = van.state('mixed') // upright
//        this._div = van.tags.div({style:()=>`padding:0;margin:0;box-sizing:border-box;writing-mode:${this._writingMode.val};overflow-x:${this._overflowX.val};overflow-y:${this._overflowY.val};text-orientation:${this._textOrient.val};display:grid;grid-template-columns:50% 50%;grid-template-rows:${this._blockSize.val}px;`}, this._left.el, this._right.el)
        this._gridTemplateColumns = van.state('48% 4% 48%')
        this._gridTemplateRows = van.state(document.body.clientHeight)
        //this._div = van.tags.div({style:()=>`padding:0;margin:0;box-sizing:border-box;display:grid;grid-template-columns:50% 50%;grid-template-rows:${this._blockSize.val}px;`}, this._left.el, this._right.el)
        this._div = van.tags.div({style:()=>`padding:0;margin:0;box-sizing:border-box;display:grid;grid-template-columns:${this._gridTemplateColumns.val};grid-template-rows:${this._gridTemplateRows.val};`}, this._left.el, this._right.el)
    }
    get el() { return this._div }
    get left() { return this._left }
    get right() { return this._right }
    resize() {
//        console.log('this.isLandscape:', this.isLandscape)
//        this._writingMode.val = this.#writingMode
//        this._blockSize.val = this.#blockSize
        this.#setGridTemplate()
    }
    #setGridTemplate() {
        const screenSize = Math.floor(this.#longEdgeSize * 0.48)
        const centerSize = Math.floor(Math.max(18, this.#longEdgeSize * 0.04))
        const longEdgeGrid = `${screenSize}px ${centerSize}px ${screenSize}px`
        const shortEdgeGrid = `${Math.floor(this.#shortEdgeSize)}px`
        this._gridTemplateColumns.val = ((this.isLandscape) ? longEdgeGrid : shortEdgeGrid)
        this._gridTemplateRows.val = ((this.isLandscape) ? shortEdgeGrid : longEdgeGrid)
        console.log(this._gridTemplateColumns.val)
        console.log(this._gridTemplateRows.val)
        this._left.children = [p('isLandscape:', this.isLandscape), p('body.client:', document.body.clientWidth, ',', document.body.clientHeight), p('documentElement.client:', document.documentElement.clientWidth, ',', document.documentElement.clientHeight), p('window.inner:', window.innerWidth, ',', window.innerHeight), p('long,short:', this.#longEdgeSize, ',', this.#longEdgeSize), p('gridTemplateColumns:', this._gridTemplateColumns.val), p('gridTemplateRows:', this._gridTemplateRows.val)]
    }
    get #longEdgeSize() { return Math.max(this.#width, this.#height) }
    get #shortEdgeSize() { return Math.min(this.#width, this.#height) }
    get #width() { return document.body.clientWidth; }
    get #height() { return document.documentElement.clientHeight; }
//    get #writingMode() { return ((this.isLandscape) ? 'horizontal-tb' : 'vertical-rl') }
//    get #blockSize() { return Math.floor(((this.isLandscape) ? document.body.clientHeight : document.body.clientWidth)) }
    get isLandscape() { return (document.body.clientHeight < document.body.clientWidth) }
    get isPortrate() { return !this.isLandscape }
    get isHorizontal() { return ('horizontal-tb'===this._writingMode.val) }
    get isVertical() { return !this.isHorizontal }
    set isVertical(v) { if(v) { this._writingMode = 'vertical-rl' }  }
    set isHorizontal(v) { if(v) { this._writingMode = 'horizontal-tb' }  }
    /*
    toggleWritingMode() {
        this._writingMode.val = (('horizontal-tb'===this._writingMode.val) ? 'vertical-rl' : 'horizontal-tb')
        this.#setOverflow()
    }
    #setOverflow() {
        if ('horizontal-tb'===this._writingMode.val) {
            this._overflowX.val = 'hidden'
            this._overflowY.val = 'auto'
            this._textOrient.val = 'mixed'
        } else {
            this._overflowX.val = 'auto'
            this._overflowY.val = 'hidden'
            this._textOrient.val = 'upright'
        }
    }
    */
}
class TripleScreen {
    constructor() {
        this._left = new SingleScreen()
        this._right = new SingleScreen()
        this._center = new SingleScreen()
//        this._inlineSize = van.state(document.body.clientWidth)
//        this._blockSize = van.state(document.body.clientHeight)
//        this._writingMode = van.state('horizontal-tb') // vertical-rl
        this._gridTemplateColumns = van.state('48% 4% 48%')
        this._gridTemplateRows = van.state(document.body.clientHeight)
//        this._overflowX = van.state('auto')
//        this._overflowY = van.state('auto')
//        this._textOrient = van.state('mixed') // upright
        //this._div = van.tags.div({style:()=>`padding:0;margin:0;box-sizing:border-box;writing-mode:${this._writingMode.val};overflow-x:${this._overflowX.val};overflow-y:${this._overflowY.val};text-orientation:${this._textOrient.val};display:grid;grid-template-columns:${this._gridTemplateColumns.val};grid-template-rows:${this._gridTemplateRows.val};`}, this._left.el, this._center.el, this._right.el)
        this._div = van.tags.div({style:()=>`padding:0;margin:0;box-sizing:border-box;display:grid;grid-template-columns:${this._gridTemplateColumns.val};grid-template-rows:${this._gridTemplateRows.val};`}, this._left.el, this._center.el, this._right.el)
    }
    get el() { return this._div }
    get left() { return this._left }
    get right() { return this._right }
    get center() { return this._center }
    resize() {
        this.#setGridTemplate()
        this._center.wordBreak = ((this.isLandscape) ? 'break-all' : 'normal')
        //this._left.children = [p('writingMode:', this._writingMode.val), p('isLandscape:', this.isLandscape), p(document.body.clientWidth, ',', document.body.clientHeight), p('gridTemplateColumns:', this._gridTemplateColumns.val), p('blockSize:', this._blockSize.val), p('inlineSize:', this._inlineSize.val)]
        /*
        console.log('this.isLandscape:', this.isLandscape, document.body.clientWidth, document.body.clientHeight, window.innerHeight, this.#inlineSize, this.#blockSize)
        this._writingMode.val = this.#writingMode
        this._blockSize.val = this.#blockSize
        this._inlineSize.val = this.#inlineSize
        const screenSize = Math.floor(this.#inlineSize * 0.48)
        const centerSize = Math.floor(Math.max(18, this.#inlineSize * 0.04))
        this._gridTemplateColumns.val = `${screenSize}px ${centerSize}px ${screenSize}px`
        this._gridTemplateRows.val = `${((this.isLandscape) ? )}px`
        this._center.wordBreak = ((this.isLandscape) ? 'break-all' : 'normal')
        this._left.children = [p('writingMode:', this._writingMode.val), p('isLandscape:', this.isLandscape), p(document.body.clientWidth, ',', document.body.clientHeight), p('gridTemplateColumns:', this._gridTemplateColumns.val), p('blockSize:', this._blockSize.val), p('inlineSize:', this._inlineSize.val)]
        */
    }
    #setGridTemplate() {
        const screenSize = Math.floor(this.#longEdgeSize * 0.48)
        const centerSize = Math.floor(Math.max(18, this.#longEdgeSize * 0.04))
        const longEdgeGrid = `${screenSize}px ${centerSize}px ${screenSize}px`
        const shortEdgeGrid = `${Math.floor(this.#shortEdgeSize)}px`
        this._gridTemplateColumns.val = ((this.isLandscape) ? longEdgeGrid : shortEdgeGrid)
        this._gridTemplateRows.val = ((this.isLandscape) ? shortEdgeGrid : longEdgeGrid)
        console.log(this._gridTemplateColumns.val)
        console.log(this._gridTemplateRows.val)
        this._left.children = [p('isLandscape:', this.isLandscape), p('body.client:', document.body.clientWidth, ',', document.body.clientHeight), p('documentElement.client:', document.documentElement.clientWidth, ',', document.documentElement.clientHeight), p('window.inner:', window.innerWidth, ',', window.innerHeight), p('long,short:', this.#longEdgeSize, ',', this.#longEdgeSize), p('gridTemplateColumns:', this._gridTemplateColumns.val), p('gridTemplateRows:', this._gridTemplateRows.val)]
    }
    /*
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
    */
    get #longEdgeSize() { return Math.max(this.#width, this.#height) }
    get #shortEdgeSize() { return Math.min(this.#width, this.#height) }
//    get #writingMode() { return ((this.isLandscape) ? 'horizontal-tb' : 'vertical-rl') }
    get #width() { return document.body.clientWidth; }
    get #height() { return document.documentElement.clientHeight; }
    //get #width() { const c=document.body.clientWidth; const i=window.innerWidth; return Math.max(c,i); }
    //get #height() { const c=document.body.clientHeight; const i=window.innerHeight; return Math.max(c,i); } // 最初はclientが0になる場合がある。リサイズするとclientHeightが最初のサイズを保持してwindowサイズにならない場合がある
//    get #width() { const c=document.body.clientWidth; return ((0===c) ? window.innerWidth : c) }
//    get #height() { const c=document.body.clientHeight; return ((0===c) ? window.innerHeight : c) } // なぜかclientが0になる時ある
//    get #blockSize() { return Math.floor(((this.isLandscape) ? this.#height : this.#width)) }
//    get #inlineSize() { return Math.floor(((this.isLandscape) ? this.#width : this.#height)) }
    //get isLandscape() { return (document.body.clientHeight < document.body.clientWidth) }
    get isLandscape() { return (this.#height < this.#width) }
    get isPortrate() { return !this.isLandscape }
    get isHorizontal() { return ('horizontal-tb'===this._writingMode.val) }
    get isVertical() { return !this.isHorizontal }
    set isVertical(v) { if(v) { this._writingMode = 'vertical-rl' }  }
    set isHorizontal(v) { if(v) { this._writingMode = 'horizontal-tb' }  }
    /*
    toggleWritingMode() {
        this._writingMode.val = (('horizontal-tb'===this._writingMode.val) ? 'vertical-rl' : 'horizontal-tb')
        this.#setOverflow()
    }
    #setOverflow() {
        if ('horizontal-tb'===this._writingMode.val) {
            this._overflowX.val = 'hidden'
            this._overflowY.val = 'auto'
            this._textOrient.val = 'mixed'
        } else {
            this._overflowX.val = 'auto'
            this._overflowY.val = 'hidden'
            this._textOrient.val = 'upright'
        }
    }
    */
}
window.SingleScreen = SingleScreen
window.DoubleScreen = DoubleScreen
window.TripleScreen = TripleScreen
})()
