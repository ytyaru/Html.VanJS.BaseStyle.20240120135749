(function(){
class BaseStyle {
    constructor() {
        this._layout = new Layout()
        this._font = {
            'size': 16,
            'family': {
                'serif': 
                'sunsSerif': 
            }
        }
        this._color = new Color()
    }
    get layout() { return this._layout }
    get font() { return this._font }
}
class Layout {
    constructor() {

    }
}
class Color {

}
window.BaseStyle = BaseStyle
})()
