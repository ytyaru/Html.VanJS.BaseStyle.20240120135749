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
}
window.BaseStyle = BaseStyle
})()
