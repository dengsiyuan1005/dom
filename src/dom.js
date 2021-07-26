window.dom = {
    create(string) {
        const container = document.createElement("template");
        container.innerHTML = string.trim();//trims删除空格
        return container.content.firstChild;
    },
    //新增弟弟
    after(node, node2) {//在某个节点的后面插入一个节点
        node.parentNode.insertBefore(node2, node.nextSibling);
        //找到这个节点的爸爸，然后调用它的inserBefore方法，然后把node2插到node的前面
        //这个方法必须在node原有的基础上贴加nexSibling
    },
    //新增哥哥
    before(node, node2) {//在某个节点的前面插入一个节点
        node.parentNode.insertBefore(node2, node);
        //找到这个节点的爸爸，然后调用它的inserBefore方法，然后把node2插到node的后面
    },
    //新增儿子
    append(parent, node) {//你的爸爸是谁，然后把你要增加的儿子节点写上，
        parent.appendChild(node)//再用parent.appendChild方法调用儿子节点
    },
    //新增爸爸
    wrap(node, parent) {//在一个节点的外面在增加一个爸爸
        dom.before(node, parent)//把新增的爸爸放在节点的前面或后面
        dom.append(parent, node)//然后把节点放在新增的爸爸节点里面
    },
    //删除节点
    remove(node) { //把你要删除的节点放进去
        node.parentNode.removeChild(node)//让这个节点的爸爸删除它的儿子(removeChild)
        return node //删除后，还能保留这个节点的引用
    },
    empty(node) {
        const array = []
        let x = node.firstChild//要把所有的元素删掉先找到它的第一个儿子
        while (x) {//当x是存在的
            array.push(dom.remove(node.firstChild))//移除再放到数组里面，因为移除要返回一个节点所以要push一下
            x = node.firstChild//这里的firstChild不是之前第一个儿子，而是它的第二个儿子，因为第一个儿子被移除了，所以它现在的第一个儿子就是它的第二个节点
        }
        return array
    },
    //改一个div的title// 重载
    attr(node, name, value) { //接收一个节点，属性名，属性值
        if (arguments.length === 3) {//设置节点
            node.setAttribute(name, value)
        } else if (arguments.length === 2) {//只读
            return node.getAttribute(name)
        }
    },//更改文本内容// 适配
    text(node, string) { //给我一个节点，再告诉我你新传的文本是什么
        if (arguments.length === 2) {
            if ('innerText' in node) {
                node.innerText = string//IE
            } else {
                node.textContent = string//其他浏览器
            }
        } else if (arguments.length === 1) {
            if ('innerText' in node) {
                return node.innerText
            } else {
                return node.textContent
            }
        }
    },
    html(node, string) {//给我一个节点，再告诉我你的html是什么
        if (arguments.length === 2) {//设置
            node.innerHTML = string
        } else if (arguments.length === 1) {//只想获取html的文本内容
            return node.innerHTML
        }
    },
    style(node, name, value) {//有一个节点，
        if (arguments.length === 3) {//修改style的值
            // dom.style(div, 'color', 'red')
            node.style[name] = value
        } else if (arguments.length === 2) {
            if (typeof name === 'string') {
                // dom.style(div, 'color')
                return node.style[name]
            } else if (name instanceof Object) {//获取
                // dom.style(div, {color: 'red'})
                const object = name
                for (let key in object) {
                    node.style[key] = object[key]
                }
            }
        }
    },
    class: {
        add(node, className) {//接收一个节点，一个类名
            node.classList.add(className)//节点调用classList,然后add(添加)这个类名
        },
        remove(node, className) {//删除一个类名
            node.classList.remove(className)
        },
        has(node, className) {//检查里面是否有这个值
            return node.classList.contains(className)
        }
    },
    //贴加监听
    on(node, eventName, fn) {//节点，事件名，事件处理函数fn
        node.addEventListener(eventName, fn)
    },
    //移除监听
    off(node, eventName, fn) {
        node.removeEventListener(eventName, fn)
    },
    //获取标签或者标签们
    find(selector, scope) {//给我一个选择器，我返回对应的元素，范围）(scope在指定的范围里面找)
        return (scope || document).querySelectorAll(selector)//直接找，或者在指定的范围里面找
    },
    //获取父元素
    parent(node) {
        return node.parentNode
    },
    //获取子元素
    children(node) {
        return node.children
    },
    //获取兄弟姐妹元素
    siblings(node) {
        return Array.from(node.parentNode.children)//Array.from把伪数组变成数组
            .filter(n => n !== node)//然后再.filter(只有真数组才能用),找自己的的兄弟姐妹，必须得先把自己排除(n !== node)
    },
    //下一个节点
    next(node) {
        let x = node.nextSibling//x=node下一个节点
        while (x && x.nodeType === 3) {//如果nodeType(node的类型是一个文本)(里面的3表示文本)
            x = x.nextSibling//没找到就一直下一个知道找到不是文本的节点，
        }
        return x//然后再返回这个节点
    },
    //上一个节点
    previous(node) {
        let x = node.previousSibling//上一个节点
        while (x && x.nodeType === 3) {
            x = x.previousSibling
        }
        return x
    },
    //遍历所有节点
    each(nodeList, fn) {//给我一堆节点，再给我一个函数
        for (let i = 0; i < nodeList.length; i++) {//遍历节点
            fn.call(null, nodeList[i])//fn调用所有的节点的第i个(nodeList[i])
        }
    },
    //看儿子节点在父元素里排第几
    index(node) {
        const list = dom.children(node.parentNode)
        let i
        for (i = 0; i < list.length; i++) {//遍历它所有的儿子
            if (list[i] === node) {//如果要找到节点等于node就直接break，
                break
            }
        }
        return i//并返回这个节点
    }
};