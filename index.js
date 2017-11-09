/**
 * @ Tick
 * @ author: H.yingzi - h.yingzi@gmail.com
 * @ date: 2017-5-4 13:50:38
 * @ version: 0.1.0
 *
 */

let _uid = 1
let queue = {}
let REQ = null

const track = function () {
  console.error('tick:', ...arguments)
}
const render = function () {
  for (let uid in queue) {
        // try一下，防止有的函数不能运行阻止队列
    try {
      queue[uid]()
    } catch (e) {
      track('name:', uid, queue[uid])
    }
  }

  REQ = window.requestAnimationFrame(render.bind(this))
}

const Tick = {
  start () {
    render()
    return this
  },
  add (fn, name) {
    const uid = name || 'uid' + _uid++

    if (queue[uid]) {
      track('existing')
      return
    }

    queue[uid] = fn

    return uid
  },
  queue () {
    return queue
  },
  remove (uid) {
    delete queue[uid]
    return this
  },
  clear () {
    queue = {}
    return this
  },
  stop () {
    window.cancelAnimationFrame(REQ)
    return this
  }
}

window.Tick = Tick

export default Tick

if (!Date.now) {
  Date.now = function () {
    return new Date().getTime()
  }
}

var vendors = ['webkit', 'moz']
for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
  var vp = vendors[i]
  window.requestAnimationFrame = window[vp + 'RequestAnimationFrame']
  window.cancelAnimationFrame =
        window[vp + 'CancelAnimationFrame'] ||
        window[vp + 'CancelRequestAnimationFrame']
}
if (
    /iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || // iOS6 is buggy
    !window.requestAnimationFrame ||
    !window.cancelAnimationFrame
) {
  var lastTime = 0
  window.requestAnimationFrame = function (callback) {
    var now = Date.now()
    var nextTime = Math.max(lastTime + 16, now)
    return setTimeout(function () {
      callback((lastTime = nextTime))
    }, nextTime - now)
  }
  window.cancelAnimationFrame = clearTimeout
}
