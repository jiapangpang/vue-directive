import type { Directive } from 'vue'

interface Position {
  x: number
  y: number
  offsetWidth: number
  offsetHeight: number
  width: number
  height: number
  top: number
  left: number
  placeholder?: HTMLElement
  style: string
  maxWidth?: number
  maxHeight?: number
  overflowX: number
  overflowY: number
}
const sizeReg = /^(\d+)px$/i

function registerDrag(el: HTMLElement, container: HTMLElement, position: Position, direction: string, reverse = false) {
  /**
   * Returns the average of two numbers.
   *
   * @remarks
   * This method is part of the {@link sizeDragDirective}.
   *
   * @param e - {@link MouseEvent}
   *
   * @beta
   */
  function mousedown(e: MouseEvent) {
    position.x = e.clientX
    position.y = e.clientY
    window.addEventListener('mousemove', mousemove)
    window.addEventListener('mouseup', mouseup)
    takeoff(container, position)
    if (direction === 'y')
      document.body.style.cursor = 'col-resize'

    else
      document.body.style.cursor = 'row-resize'

    e.stopPropagation()
    e.preventDefault()
  }
  function mousemove(e: MouseEvent) {
    if (direction === 'y') {
      const newY = e.clientY
      const deltaY = reverse ? position.y - newY : newY - position.y
      const nextHeight = position.height + deltaY
      const virtualHeight = position.height + position.overflowY + deltaY
      if (position.maxHeight && virtualHeight > position.maxHeight) {
        if (position.maxHeight !== position.height) {
          const delta = position.maxHeight - position.height
          position.overflowY = nextHeight - position.maxHeight
          position.height = position.maxHeight
          if (reverse) {
            position.top -= delta
            container.style.top = `${position.top}px`
          }
          container.style.height = `${position.height}px`
        }
        else {
          position.overflowY = position.overflowY + deltaY
        }
      }
      else {
        position.height = nextHeight
        if (reverse) {
          position.top -= deltaY
          container.style.top = `${position.top}px`
        }
        container.style.height = `${position.height}px`
      }
    }

    if (direction === 'x') {
      const newX = e.clientX
      const deltaX = reverse ? position.x - newX : newX - position.x
      const nextWidth = position.width + deltaX
      const virtualWidth = position.width + position.overflowX + deltaX
      if (position.maxWidth && virtualWidth > position.maxWidth) {
        if (position.maxWidth !== position.width) {
          const delta = position.maxWidth - position.width
          position.overflowX = nextWidth - position.maxWidth
          position.width = position.maxWidth
          if (reverse) {
            position.left -= delta
            container.style.left = `${position.left}px`
          }
          container.style.width = `${position.width}px`
        }
        else {
          position.overflowX = position.overflowX + deltaX
        }
      }
      else {
        position.width = nextWidth
        if (reverse) {
          position.left -= deltaX
          container.style.left = `${position.left}px`
        }
        container.style.width = `${position.width}px`
      }
    }
    position.x = e.clientX
    position.y = e.clientY
  }
  function mouseup() {
    window.removeEventListener('mousemove', mousemove)
    window.removeEventListener('mouseup', mouseup)
    position.overflowX = 0
    position.overflowY = 0
    land(container, position)
    document.body.style.cursor = ''
  }
  el.addEventListener('mousedown', mousedown, true)
}

const sizeDragDirective: Directive = {
  created() {
  },
  // 在元素被插入到 DOM 前调用
  beforeMount() { },
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el: HTMLElement) {
    el.setAttribute('dragContainer', '')
    const { up, bottom, left, right } = createBar(el)
    const position: Position = creatPosition(el)
    registerDrag(up, el, position, 'y', true)
    registerDrag(bottom, el, position, 'y')
    registerDrag(left, el, position, 'x', true)
    registerDrag(right, el, position, 'x')
  },
  // 绑定元素的父组件更新前调用
  beforeUpdate() { },
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated() {
  }, // 绑定元素的父组件卸载前调用
  beforeUnmount() { },
  // 绑定元素的父组件卸载后调用
  unmounted() { },
}

export default sizeDragDirective

function creatPosition(el: HTMLElement) {
  const position: Position = {
    x: 0,
    y: 0,
    offsetWidth: 0,
    offsetHeight: 0,
    width: el.clientWidth,
    height: el.clientHeight,
    top: 0,
    left: 0,
    style: '',
    overflowX: 0,
    overflowY: 0,
  }
  const computeStyle = getComputedStyle(el)
  let result: RegExpMatchArray | null = null
  result = computeStyle.maxWidth.match(sizeReg)
  if (result)
    position.maxWidth = parseInt(result[1])

  result = computeStyle.maxHeight.match(sizeReg)
  if (result)
    position.maxHeight = parseInt(result[1])

  position.placeholder = createPlaceHolder()
  return position
}
function createPlaceHolder() {
  const placeholder = document.createElement('div')
  return placeholder
}
function takeoff(el: HTMLElement, position: Position) {
  const { top, left, width, height } = el.getBoundingClientRect()
  position.style = el.style.transition
  position.top = top
  position.left = left
  position.offsetWidth = width
  position.offsetHeight = height
  const anchor = el.nextElementSibling
  const placeholder = position.placeholder!
  placeholder.style.position = 'static'
  placeholder.style.height = `${position.offsetHeight}px`
  placeholder.style.width = `${position.offsetWidth}px`
  el.parentElement?.insertBefore(placeholder!, anchor)
  el.style.position = 'absolute'
  el.style.transition = 'none'
  el.style.top = `${position.top}px`
  el.style.left = `${position.left}px`
}
function land(el: HTMLElement, position: Position) {
  const placeholder = position.placeholder!
  const anchor = placeholder.nextElementSibling
  placeholder.style.position = 'absolute'
  placeholder.style.height = '0px'
  placeholder.style.width = '0px'
  placeholder.parentElement?.insertBefore(el, anchor)
  placeholder.style.top = '0px'
  placeholder.style.left = '0px'
  el.style.top = ''
  el.style.left = ''
  el.style.position = 'relative'
  el.style.transition = position.style
}
function createBar(el: HTMLElement) {
  const up = document.createElement('div')
  const bottom = document.createElement('div')
  const left = document.createElement('div')
  const right = document.createElement('div')
  up.classList.add('up-bar')
  bottom.classList.add('bottom-bar')
  left.classList.add('left-bar')
  right.classList.add('right-bar')
  el.appendChild(up)
  el.appendChild(bottom)
  el.appendChild(left)
  el.appendChild(right)
  return { up, bottom, left, right }
}
