export interface PositionContext {
  /**
       * @description
       * 拖拽时的x坐标
       */
  x: number
  /**
       * @description
       * 拖拽时的y坐标
       */
  y: number
  /**
     * @description
     * 渲染的模式，false为元素在文档流中，position:static/relative.
     */
  separateMode?: boolean
  /**
       * @description
       * 占位用的宽度，需要包含padding和border
       */
  offsetWidth: number
  /**
       * @description
       * 占位用的高度，需要包含padding和border
       */
  offsetHeight: number
  /**
       * @description
       * 拖拽之后的宽度
       */
  width: number
  /**
       * @description
       * 拖拽之后的高度
       */
  height: number
  /**
       * @description
       * 拖拽过程中的top值，把元素定在原先的位置上
       */
  top: number
  /**
       * @description
       * 拖拽过程中的left值，把元素定在原先的位置上
       */
  left: number
  placeholder?: HTMLElement
  /**
       * @description
       * style属性的rawString值
       */
  style: string
  maxWidth?: number
  maxHeight?: number
  minWidth?: number
  minHeight?: number
  /**
       * @description
       * 到达限制宽度后，溢出的宽度
       */
  overflowX: number
  /**
       * @description
       * 到达限制高度后，溢出的高度
       */
  overflowY: number
  /**
       * @description
       * styleItem的缓存
       */
  cacheStyle: Record<string, string>
  needUpdate: boolean
}
const sizeReg = /^(\d+)px$/i
export function creatPositionContext(el: HTMLElement) {
  const positionContext: PositionContext = {

    x: 0,

    y: 0,
    offsetWidth: 0,
    offsetHeight: 0,
    separateMode: false,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    style: '',
    overflowX: 0,
    overflowY: 0,
    needUpdate: false,
    cacheStyle: {},
  }
  initContext(el, positionContext)
  return positionContext
}
function initContext(el: HTMLElement, positionContext: PositionContext) {
  positionContext.width = el.clientWidth
  positionContext.height = el.clientHeight
  const computeStyle = getComputedStyle(el)
  getSizeLimit(computeStyle, positionContext)
  const position = computeStyle.position
  positionContext.separateMode = position === 'absolute' || position === 'fixed'
  if (!positionContext.separateMode) {
    if (!positionContext.placeholder)
      positionContext.placeholder = createPlaceHolder()
  }
  else {
    positionContext.placeholder = undefined
  }
}

export function updatePositionContext(el: HTMLElement) {
  const context = el.__sizeDrag
  if (context) {
    initContext(el, context)
    context.needUpdate = false
  }
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
export function createBar(el: HTMLElement) {
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
