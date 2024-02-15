window.addEventListener('DOMContentLoaded', (event) => {
    const {div,h1,p,button} = van.tags
    window.app = window.app || {}
    window.app.screen = new TripleScreen()
    window.app.screen.center.children = [
        button({onclick:()=>window.app.screen.right.children[1] = '既存配列要素の値を変更する'}, 'change'),
        button({onclick:()=>window.app.screen.right.children.push(p('既存配列に要素を追加する'))}, 'push'),
        button({onclick:()=>window.app.screen.right.children = [h1('新配列を代入する'), p('配列まるごと更新！')]}, 'new Array'),
        button({onclick:()=>window.app.screen.right.toggleWritingMode()}, '書字方向変更'),
        button({onclick:()=>colorMode.toggle()}, '配色変更'),
    ]
    window.app.screen.right.children = [h1('見出し2'), p('本文2'), Array.times(50, (i)=>{console.log(i);return van.tags.p(String.fromCharCode(12353+i).repeat(200), i)})]
    van.add(document.body, window.app.screen.el)
    window.dispatchEvent(new Event('resize'))
})
window.addEventListener('resize', (event) => {
    window.app.screen.resize()
})
