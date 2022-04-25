import type { Directive } from 'vue'
import registerDrag from './action'

export interface PositionContext {
  x: number
  y: number
  /**
   * @description
   * 渲染的模式，false为元素在文档流中，position:static/relative.
   */
  separateMode?: boolean
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
  minWidth?: number
  minHeight?: number
  overflowX: number
  overflowY: number
  cacheStyle: Record<string, string>
}
const sizeReg = /^(\d+)px$/i

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
    const position: PositionContext = creatPositionContext(el)
    el.__sizeDrag = position
    registerDrag(up, el, position, 'y', true)
    registerDrag(bottom, el, position, 'y')
    registerDrag(left, el, position, 'x', true)
    registerDrag(right, el, position, 'x')
  },
  // 绑定元素的父组件更新前调用
  beforeUpdate() {
  },
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated() {
    // TODO: 想办法更新position,或者注册到el上
  }, // 绑定元素的父组件卸载前调用
  beforeUnmount() { },
  // 绑定元素的父组件卸载后调用
  unmounted(el: HTMLElement) {
    el.__sizeDrag = null
  },
}

export default sizeDragDirective

/**
   * Returns PositionContext
   *
   * @description
   */
function creatPositionContext(el: HTMLElement) {
  const positionContext: PositionContext = {
    x: 0,
    y: 0,
    offsetWidth: 0,
    offsetHeight: 0,
    separateMode: false,
    width: el.clientWidth,
    height: el.clientHeight,
    top: 0,
    left: 0,
    style: '',
    overflowX: 0,
    overflowY: 0,
    cacheStyle: {},
  }
  const computeStyle = getComputedStyle(el)
  getSizeLimit(computeStyle, positionContext)
  const position = computeStyle.position
  positionContext.separateMode = position === 'absolute' || position === 'fixed'
  if (!positionContext.separateMode)
    positionContext.placeholder = createPlaceHolder()

  // eslint-disable-next-line no-console
  console.log(positionContext)

  return positionContext
}
function getSizeLimit(computeStyle: CSSStyleDeclaration, position: PositionContext) {
  let result: RegExpMatchArray | null = null
  result = computeStyle.maxWidth.match(sizeReg)
  if (result)
    position.maxWidth = parseInt(result[1])

  result = computeStyle.maxHeight.match(sizeReg)
  if (result)
    position.maxHeight = parseInt(result[1])

  result = computeStyle.minWidth.match(sizeReg)
  if (result)
    position.minWidth = parseInt(result[1])

  result = computeStyle.minHeight.match(sizeReg)
  if (result)
    position.minHeight = parseInt(result[1])
}

/**
   * Returns PositionContext
   *
   * @description
   * 返回占位的元素
   */
function createPlaceHolder() {
  const placeholder = document.createElement('div')
  return placeholder
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
