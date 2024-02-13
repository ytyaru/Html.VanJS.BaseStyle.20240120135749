window.addEventListener('DOMContentLoaded', (event) => {
    const {div,h1,p,button} = van.tags
    window.win = new TripleScreen()
    window.win.center.children = [
        button({onclick:()=>window.splitScreen.right.children[1] = '既存配列要素の値を変更する'}, 'change'),
        button({onclick:()=>window.splitScreen.right.children.push(p('既存配列に要素を追加する'))}, 'push'),
        button({onclick:()=>window.splitScreen.right.children = [h1('新配列を代入する'), p('配列まるごと更新！')]}, 'new Array'),
        button({onclick:()=>window.splitScreen.right.toggleWritingMode()}, '書字方向変更'),
    ]
    window.win.right.children = [h1('見出し2'), p('本文2'), Array.times(50, (i)=>{console.log(i);return van.tags.p(String.fromCharCode(12353+i).repeat(200), i)})]
    van.add(document.body, window.win.el)
    window.dispatchEvent(new Event('resize'))
    van.add(document.body, p('aaaaa'))
})
window.addEventListener('resize', (event) => {
    window.win.resize()
})


