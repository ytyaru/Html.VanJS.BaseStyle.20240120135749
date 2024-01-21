window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOMContentLoaded!!');
    /*
    const {h1, p, a} = van.tags
    van.add(document.querySelector('main'), 
        h1(a({href:`https://github.com/${author}/Html.VanJS.BaseStyle.20240120135749/`}, 'BaseStyle')),
        p('基本的なCSS設定をする（レスポンシブ・配色）'),
//        p('Make basic CSS settings (responsive/color scheme)'),
    )
    van.add(document.querySelector('footer'),  new Footer('ytyaru', '../').make())
    const baseStyle = new BaseStyle()
    console.log(baseStyle)
    */
    const baseStyle = new BaseStyle()
    const {div, h1, h2, p, a} = van.tags
    const author = 'ytyaru'
    van.add(document.body, div({id:'split-panel', style:baseStyle.layout.style.bind(baseStyle)},
        div(h1({style:`background-color:#d00;`},'first'), h2(a({href:`https://github.com/${author}/Html.VanJS.BaseStyle.20240120135749/`}, 'BaseStyle')), p('基本的なCSS設定をする（レスポンシブ・配色）')),
        div({style:`background-color:#0d0;`}, 'menu'),
        div({style:`background-color:#00d;`}, h1('last')),
    ))
    /*
//    Css.set('background-color', baseStyle.color.base.hex(), document.body)
//    Css.set('color', baseStyle.color.main.hex(), document.body)
    Css.set('--background-color', baseStyle.color.base.hex())
    Css.set('--color', baseStyle.color.main.hex())
    Css.set('--em-color', baseStyle.color.main.hex())
    Css.set('--a-color', baseStyle.color.accent.hex())
    */
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

