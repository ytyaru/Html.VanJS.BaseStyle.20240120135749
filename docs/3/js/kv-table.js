(function(){
const {table,tbody,thead,tfoot,tr,th,td,caption} = van.tags
class KvTable { // ラベルとUIの列を持ったテーブル（th,tdはdisplay:block/inlineを切り替える）
    constructor(doms) {
        this._doms = doms
        this._display = van.state('table-cell')
    }
    //make() { return table({class:'kv-table'}, ...this.#trs()) }
    make() { return table({class:'kv-table'}, ()=>tbody(this.#trs())) }
    #trs() { return this._doms.map(dom=>this.#tr(dom)) }
    #tr(dom) { return tr(
        th({style:()=>`display:${this._display.val};`}, dom.lb),
        td({style:()=>`display:${this._display.val};`}, dom.el, dom.dl),
    )}
    a() { }
    resize() {
        console.log('inline-size:', Css.getInt('inline-size'))
        this._display = ((Css.getInt('inline-size') < 480) ? 'block' : 'table-cell')
    }
    //resize() { this._display = (((Css.getInt('inline-size') < 480) ? 'block' : 'inline') }
}
window.KvTable = KvTable
})()
