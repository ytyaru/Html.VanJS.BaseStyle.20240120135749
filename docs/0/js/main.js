window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOMContentLoaded!!');
    const {h1, p, a} = van.tags
    const author = 'ytyaru'
    van.add(document.querySelector('main'), 
        h1(a({href:`https://github.com/${author}/Html.VanJS.BaseStyle.20240120135749/`}, 'BaseStyle')),
        p('基本的なCSS設定をする（レスポンシブ・配色）'),
//        p('Make basic CSS settings (responsive/color scheme)'),
    )
    van.add(document.querySelector('footer'),  new Footer('ytyaru', '../').make())
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

