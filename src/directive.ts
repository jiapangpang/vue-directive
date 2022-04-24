import type { Directive } from 'vue'

interface Position { x: number; y: number; width: number; height: number; top: number; left: number }

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
      position.height += deltaY
      if (reverse) {
        position.top -= deltaY
        container.style.top = `${position.top}px`
      }
      container.style.height = `${position.height}px`
    }

    if (direction === 'x') {
      const newX = e.clientX
      const deltaX = reverse ? position.x - newX : newX - position.x
      position.width += deltaX
      if (reverse) {
        position.left -= deltaX
        container.style.left = `${position.left}px`
      }
      container.style.width = `${position.width}px`
    }
    position.x = e.clientX
    position.y = e.clientY
  }
  function mouseup() {
    window.removeEventListener('mousemove', mousemove)
    window.removeEventListener('mouseup', mouseup)
    document.body.style.cursor = ''
  }
  el.addEventListener('mousedown', mousedown, true)
}

function absoluteDisplay(el: HTMLElement) {
  const { top, left } = el.getBoundingClientRect()
  const position: Position = { x: 0, y: 0, width: el.clientWidth, height: el.clientHeight, top, left }
  el.style.position = 'absolute'
  el.style.top = `${top}px`
  el.style.left = `${left}px`
  return position
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
    const position: Position = absoluteDisplay(el)
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
