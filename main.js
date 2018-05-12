var log = function() {
    console.log.apply(console, arguments)
}

var e = function(selector) {
    return document.querySelector(selector)
}

var es = function (sel) {
    return document.querySelectorAll(sel)
}

// 给多个class绑定事件
var bindAll = function (elements, eventName, callback) {
    for (var i = 0; i < elements.length; i++) {
        var tag = elements[i]
        tag.addEventListener(eventName, callback)
    }
}

var controlCSS = function() {
    // 默认显示页一留言
    var messageOne = e('#messages-1')
    if (messageOne != null) {
        messageOne.classList.add('show')
    }
    // 默认页码一加上外发光效果
    var messageOne = e('#page-1')
    if (messageOne != null) {
        messageOne.classList.add('active')
    }
    // 根据页数的多少决定页码模块宽度
    if (localStorage.length != 0) {
        var m = JSON.parse(localStorage.simpletodos)
    } else {
        var m = 0
    }
    var pages = Math.ceil(m.length / 5)
    var width = pages * 30
    var pagebox = e('#pagebox')
    pagebox.style.width = `${width}px`
}

var newpage = function() {
    if (localStorage.length != 0) {
        var m = JSON.parse(localStorage.simpletodos)
    } else {
        var m = 0
    }
    var pages = Math.ceil(m.length / 5)
    log('pages', pages)
    for (var i = 1; i <= pages; i++) {
        var m = `<div class="page" id="messages-${i}">
        </div>`
        var messageContainer = e('#messages')
        messageContainer.insertAdjacentHTML('beforeend', m)

        var p = `<div class="pageint" id="page-${i}" data-index="${i}">${i}</div>`
        var messageContainer = e('#pagebox')
        // 第一个参数 'beforeend' 意思是放在最后
        messageContainer.insertAdjacentHTML('beforeend', p)
    }
}

var findALL = function(element, selector) {
    return element.querySelectorAll(selector)
}

var findContainer = function() {
    var pagemax = es('.page').length
    for (var i = 1; i <= pagemax; i++) {
        var c = '#messages-'
        var container = e(c + i)
        var cl = findALL(container, '*').length
        if (cl < 20) {
            return container
        } else if (cl >= 20) {
            continue
        }
    }
}
var insertTodo = function(message) {
    // 添加到 container 中
    var todoContainer = findContainer()
    var t = templateMessage(message)
    // 这个方法用来添加元素
    // 第一个参数 'beforeend' 意思是放在最后
    todoContainer.insertAdjacentHTML('beforeend', t)
}


// 创建一个 messages 数组用来保存所有的 todo
var messages = []

// 载入页面的时候  把已经有的 todo 加载到页面中
var loadMessages = function() {
    log('loadMessages 反序列化之前', messages)
    if (localStorage.length != 0) {
        messages = JSON.parse(localStorage.simpletodos)
    }
    log('loadMessages 反序列化之后', messages)
    for (var i = 0; i < messages.length; i++) {
        var m = messages[i]
        insertTodo(m)
    }
}

// 添加新的留言
var buttonClick = function() {
    var button = e('#button')
    var input = e('#input')
    button.addEventListener('click', function(event){
        var message = input.value
        log('有新的留言', message)
        // 把新添加的 message 加入 messages 并且写入到 localStorage
        if (message.length >= 1) {
            messages.push(message)
            localStorage.simpletodos = JSON.stringify(messages)
            // 删除页面中所有的 message 并重新把 所有的 message
            // 添加到 container 中
            insertTodo(message)
            swal("干得漂亮！", "HTTP://123456shoudeyunkai.cn","success")
        }
    })
}

var templateMessage = function(message) {
    var m = `
    <div class="message-cell">
        <div class="message-bg">
            <div class='message-content' >${message}</div>
        </div>
        <img class='message-delete' src=delete.png>
    </div>
    `
    return m
}

var bindEventSwitch = function() {
    var selector = es('.pageint')
    bindAll(selector, 'click', function(event){
        console.log('click page')
        var button = event.target
        var xwbc = button.dataset.index
        // 切换页码相应 class
        var a = e('.active')
        a.classList.remove('active')
        var img = '#page-' + String(xwbc)
        var img1 = e(img)
        img1.classList.add('active')

        // 切换相应页数的留言
        var s = e('.show')
        s.classList.remove('show')
        var page = '#messages-' + String(xwbc)
        var page1 = e(page)
        page1.classList.add('show')
    })
}

var bindEventPassword = function() {
    var selector = es('.message-delete')
    bindAll(selector, 'click', function(event){
        console.log('click delete')
        var button = event.target
        swal({
            title: "这个是管理员使用的删除功能",
            text: "乖孩子不要乱试密码",
            content: {
                element: "input",
                attributes: {
                    placeholder: "Type your password",
                    type: "password",
                },
            },
        })
        .then((value) => {
            log('input value', value)
            if (value === "pym") {
                deleteMessage(button)
            }
        })
    })
}

var deleteMessage = function(element) {
    var cell = element.parentElement
    var cells = cell.parentElement.children
    log('delete', cell, cells)
    var index = 0
    for (var i = 0; i < cells.length; i++) {
        var c = cells[i]
        if (c == cell) {
            index = i
            break
        }
    }
    log('点击的 todo 下标', index)
    // 在 todos 数组中删除这个下标的元素
    // 并且写入到 localStorage
    // splice 函数可以删除数组特定下标的元素
    // splice 的第二个参数表示删除几个
    messages.splice(index, 1)
    localStorage.simpletodos = JSON.stringify(messages)
    // 删除 todo-cell
    cell.remove()
}

newpage()
findContainer()

loadMessages()

buttonClick()
controlCSS()
bindEventSwitch()
bindEventPassword()
