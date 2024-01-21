(function(){
class BaseStyle {
    constructor() {
        this._layout = new Layout(new Client(), new WritingMode())
        this._font = { size:this._layout.fontSize, family:new FontFamily() }
        console.log(ThemeColor)
        console.log(ThemeColor.Night)
        console.log(ThemeColor.Noon)
        this._color = ThemeColor.Night.make()
    }
    get layout() { return this._layout }
    get font() { return this._font }
    get color() { return this._color }
    //get element() {return div({id:'javel-writer-min', style:appStyle.style.bind(appStyle)}, this._layout.panels.first, this._layout.panels.menu, this._layout.panels.last) }
}
window.BaseStyle = BaseStyle
})()
