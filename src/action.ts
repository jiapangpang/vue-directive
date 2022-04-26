import type { PositionContext } from './init'
import { updatePositionContext } from './init'

const CacheStyle = ['top', 'left', 'opacity', 'transition', 'z-index', 'position']
function registerDrag(el: HTMLElement, container: HTMLElement, position: PositionContext, direction: string, reverse = false) {
  function mousedown(e: MouseEvent) {
    if (position.needUpdate)
      updatePositionContext(container)

    position.x = e.clientX
    position.y = e.clientY
    window.addEventListener('mousemove', mousemove)
    window.addEventListener('mouseup', mouseup)
    takeoff(container, position)
    if (direction === 'y')
      document.body.style.cursor = 'row-resize'

    else
      document.body.style.cursor = 'col-resize'

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
      else if (position.minHeight && virtualHeight < position.minHeight) {
        if (position.minHeight !== position.height) {
          const delta = position.minHeight - position.height
          position.overflowX = nextHeight - position.minHeight
          position.height = position.minHeight
          if (reverse) {
            position.left += delta
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
      else if (position.minWidth && virtualWidth < position.minWidth) {
        if (position.minWidth !== position.width) {
          const delta = position.minWidth - position.width
          position.overflowX = nextWidth - position.minWidth
          position.width = position.minWidth
          if (reverse) {
            position.left += delta
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
function takeoff(el: HTMLElement, position: PositionContext) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  cacheStyle(el, position)
  // const { top, left, width, height } = el.getBoundingClientRect() // 如果css中有top,left则使用Rect相对于窗口的位置定位会出错
  position.style = el.attributes.getNamedItem('style')?.value || ''
  position.top = el.offsetTop
  position.left = el.offsetLeft
  position.offsetWidth = el.offsetWidth
  position.offsetHeight = el.offsetHeight
  if (!position.separateMode) {
    const anchor = el.nextElementSibling
    const placeholder = position.placeholder!
    placeholder.style.position = 'static'
    placeholder.style.height = `${position.offsetHeight}px`
    placeholder.style.width = `${position.offsetWidth}px`
    el.parentElement?.insertBefore(placeholder!, anchor)
    el.style.position = 'absolute'
  }
  el.style.transition = 'none'
  el.style.opacity = '0.8'
  el.style.zIndex = '9999'
  el.style.top = `${position.top}px`
  el.style.left = `${position.left}px`
}
function land(el: HTMLElement, position: PositionContext) {
  if (!position.separateMode) {
    const placeholder = position.placeholder!
    const anchor = placeholder.nextElementSibling
    placeholder.style.position = 'absolute'
    placeholder.style.height = '0px'
    placeholder.style.width = '0px'
    placeholder.parentElement?.insertBefore(el, anchor)
    placeholder.style.top = '0px'
    placeholder.style.left = '0px'
  }
  el.style.top = ''
  el.style.left = ''
  el.style.position = ''
  restoreStyle(el, position)
}
/**
 * @description
 * 储存卸载style中的属性
 */
function cacheStyle(el: HTMLElement, position: PositionContext) {
  const styleSheet = el.style
  CacheStyle.forEach((key) => {
    // const lowCase = key.replace(/([A-Z])/g, (match, p1) => `-${p1.toLowerCase()}`)
    const style = styleSheet.getPropertyValue(key)
    if (style)
      position.cacheStyle[key] = style
  })
}
function restoreStyle(el: HTMLElement, position: PositionContext) {
  const styleSheet = el.style
  CacheStyle.forEach((key) => {
    if (position.cacheStyle[key])
      styleSheet.setProperty(key, position.cacheStyle[key])
    else if (key === 'transition' || key === 'opacity' || key === 'z-index')
      styleSheet.setProperty(key, null)
  })
}
export default registerDrag
