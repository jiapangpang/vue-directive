import type { Directive, DirectiveBinding } from 'vue'
import registerDrag from './action'
import type { PositionContext } from './init'
import type { sizeDragCallback } from './action'
import { creatPositionContext, createBar, updatePositionContext } from './init'

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
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    el.setAttribute('dragContainer', '')
    const { up, bottom, left, right } = createBar(el)
    const position: PositionContext = creatPositionContext(el)
    el.__sizeDrag = position
    let cb: sizeDragCallback = null
    if (binding.value) {
      if (typeof binding.value === 'function')
        cb = binding.value as sizeDragCallback
    }

    registerDrag(up, el, position, 'y', cb, true)
    registerDrag(bottom, el, position, 'y', cb)
    registerDrag(left, el, position, 'x', cb, true)
    registerDrag(right, el, position, 'x', cb)
  },
  // 绑定元素的父组件更新前调用
  beforeUpdate(el) {
    el.__sizeDrag && (el.__sizeDrag.needUpdate = true)
  },
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(el) {
    // Promise.resolve().then(() => {
    //   updatePositionContext(el)
    // })
    updatePositionContext(el)
  }, // 绑定元素的父组件卸载前调用
  beforeUnmount() { },
  // 绑定元素的父组件卸载后调用
  unmounted(el: HTMLElement) {
    el.__sizeDrag = null
  },
}

export default sizeDragDirective
