// import { ContentsNode } from '@/utils/ContentsNode'
// import * as DOM from '@/utils/DocumentInterface'
// import { TextNode } from './TextNode'
import { ContentsNode } from '../nodes/ContentsNode'
import * as DOM from './DocumentInterface'
import { TextNode } from '../nodes/TextNode'

export const IsAtNodeEnd = (
  l: number,
  n: number,
  o: number,
  contents: ContentsNode
): any => {
  const child = contents.children[l].children[n].child
  if (child && child instanceof TextNode && child.value) {
    return o === child.value.length
  } else {
    return false
  }
}

export const IsAtNodeStart = (o: number): any => {
  return o === 0
}

export const IsAtLineEnd = (
  l: number,
  n: number,
  o: number,
  contents: ContentsNode
): any => {
  const child = contents.children[l].children[n].child
  const lineLength = contents.children[l].children.length
  if (child && child instanceof TextNode && child.value) {
    return (o === child.value.length) &&
      (n >= lineLength - 1)
  }
}

export const IsAtLineStart = (
  n: number,
  o: number
): any => {
  return n === 0 && o === 0
}

export const IsSelection = (
  select: any
): any => {
  if (select.anchorNode !== select.focusNode) {
    return true
  } else {
    return select.anchorOffset !== select.focusOffset
  }
}

export const SetPosition = (
  l: number,
  n: number,
  position: number
): any => {
  const el = document.getElementById(DOM.GetNodeId(l, n))
  if (el) {
    const range = document.createRange()
    if (position === 0) {
      range.selectNode(el)
      range.collapse(true)
    } else {
      range.setStart(el, 1)
      range.setEnd(el, 1)
    }

    const s = window.getSelection()
    if (s) {
      s.removeAllRanges()
      s.addRange(range)
    }
  }
}

export const GetPosition = (
  select: any
) => {
  const isCursor = select?.anchorNode === select?.focusNode &&
    select?.anchorOffset === select?.focusOffset
  if (isCursor) {
    const parentId = select?.focusNode?.parentElement?.id
    if (parentId === DOM.View.Root?.id) {
      console.log('c-' + select?.focusOffset)
    } else if (DOM.IsLineIdValid(parentId)) {
      console.log('l-' + select?.focusOffset)
    } else if (DOM.IsNodeIdValid(parentId)) {
      console.log('n-' + select?.focusOffset)
    } else {
      console.log('undefined-' + parentId)
    }
  }
  return {
    isCursor: isCursor
  }
}
