// import { TextNode, TextNodeStyle } from '@/utils/TextNode'
// import { LineContent } from '@/utils/LineNode'
import { TextNode, TextNodeStyle } from '../nodes/TextNode'
import { LineContent } from '../nodes/LineNode'

export const StyleCopy = (nodeStyle: TextNodeStyle): TextNodeStyle => {
  const target = new TextNodeStyle()
  if (nodeStyle.fontSize) {
    target.fontSize = nodeStyle.fontSize
  }
  if (nodeStyle.fontWeight) {
    target.fontWeight = nodeStyle.fontWeight
  }
  if (nodeStyle.color) {
    target.color = nodeStyle.color
  }
  if (nodeStyle.font) {
    target.font = nodeStyle.font
  }
  return target
}

export const NodeCopy = (node: TextNode): TextNode => {
  const newNode = new TextNode(node.tag)
  let style: TextNodeStyle
  if (node.value) {
    let val = ''
    val = node.value
    newNode.value = val
  }
  if (node.style) {
    style = StyleCopy(node.style)
    newNode.style = style
  }
  return newNode
}

export const LineContentCopy = (node: TextNode): LineContent => {
  const newLineContent = new LineContent()
  newLineContent.child = NodeCopy(node)
  return newLineContent
}

export const IsStyleEqual = (t: TextNodeStyle | undefined, s: TextNodeStyle | undefined): boolean => {
  if (t !== undefined && s !== undefined) {
    const keys: object = {
      fontSize: undefined,
      fontWeight: undefined,
      font: undefined,
      fontColor: undefined
    }
    for (const key in keys) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      if (t[key] && s[key]) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        keys[key] = t[key] === s[key]
      } else if (
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        t[key] === undefined &&
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        s[key] === undefined
      ) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        keys[key] = true
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        keys[key] = false
      }
    }
    for (const key in keys) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      if (keys[key] === false) {
        return false
      }
    }
    return true
  } else if (t === undefined && s === undefined) {
    return true
  } else {
    return false
  }
}
