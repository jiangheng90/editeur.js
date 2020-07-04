// import { ContentsNode } from '@/utils/ContentsNode'
// import { LineNode } from '@/utils/LineNode'
// import { GetFontSize, TextNode, TextNodeStyle } from '@/utils/TextNode'
// import * as DOM from '@/utils/DocumentInterface'
// import { SelectionNode, Selection } from '@/utils/Selection'
// import * as DeepClone from '@/utils/DeepClone'
// import { MouseSelectionInterface, SelectionNodeInterface } from '@/components/editor/types/Selection'
// import * as Cursor from '@/utils/Cursor'
// import { ListItemNode } from './ListItemNode'
import { ContentsNode } from '../nodes/ContentsNode'
import { LineNode } from '../nodes/LineNode'
import { TextNode } from '../nodes/TextNode'
import { ListItemNode } from '../nodes/ListItemNode'
import * as DOM from './DocumentInterface'
import * as DeepClone from './DeepClone'

export const MergeNode = (
  l: number,
  n: number,
  contents: ContentsNode
): any => {
  if (contents.IsNodeAtLineEnd(l, n)) {
    return false
  } else {
    const pChild = contents.children[l].children[n]
    const nChild = contents.children[l].children[n + 1]
    if (pChild.child &&
      nChild.child
    ) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      if (DeepClone.IsStyleEqual(pChild.child.style, nChild.child.style) &&
        (pChild.child.tag === nChild.child.tag)
      ) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        pChild.child.value += nChild.child.value
        contents.children[l].children.splice(n + 1, 1)
        return true
      }
    } else {
      return false
    }
  }
}

export const MergeNodeInContent = (
  contents: ContentsNode
) => {
  let l = 0
  while (l < contents.children.length) {
    const line = contents.children[l]
    let n = 0
    while (n < line.children.length) {
      const merge = MergeNode(l, n, contents)
      if (!merge) {
        n++
      }
    }
    l++
  }
}

export const RenderTextNodeModel = (
  text: any,
  l: number,
  n: number,
  lin?: number
): TextNode => {
  let textNode: TextNode
  if (text.childNodes.length > 1) {
    const txt = text.innerText
    text.innerText = txt
  }
  if (DOM.isText(text)) {
    textNode = new TextNode('span', text.nodeValue)
    DOM.ConvertTextToSpan(text, l, n)
  } else {
    textNode = new TextNode(text.tagName, text.innerText)
  }
  // const textNode = new TextNode(text.tagName, text.innerText)
  let eNode = text
  while (eNode && eNode.tagName) {
    if (eNode.tagName === 'STRONG') {
      textNode.bold = true
    } else if (eNode.tagName === 'EM') {
      textNode.italic = true
    } else if (eNode.tagName === 'S') {
      textNode.delete = true
    } else if (eNode.tagName === 'U') {
      textNode.underScore = true
    }

    eNode = eNode.firstChild
    if (eNode && eNode.tagName) {
      eNode.id = DOM.GetNodeId(l, n, lin) +
        '-' + eNode.tagName.toLowerCase()
    }
  }
  if (DOM.HasStyle(text)) {
    textNode.style = DOM.GetStyle(text)
  }
  return textNode
}

export const InitModel = (
  c: ContentsNode|undefined
): ContentsNode => {
  if (c === undefined) {
    c = new ContentsNode()
    const newLine = new LineNode()
    const node = new TextNode('br')
    newLine.PushChild(node)
    c.PushChild(newLine)
  }
  return c
}

export const RenderModel = (el: HTMLElement) => {
  const contentsNode = new ContentsNode()
  el.childNodes.forEach((
    line: any,
    l: number
  ) => {
    const lineNode = new LineNode()
    line.id = DOM.GetLineId(l)
    const ltName = line.tagName.toLowerCase()
    lineNode.tag = ltName
    if (ltName === 'p') {
      line.childNodes.forEach((
        text: any,
        n: number
      ) => {
        text.id = DOM.GetNodeId(l, n)
        const textNode = RenderTextNodeModel(text, l, n)
        lineNode.PushChild(textNode)
      })
    } else if (ltName === 'ul' || ltName === 'ol') {
      const ul = line
      ul.childNodes.forEach((
        li: any,
        n: number
      ) => {
        const listItemNode = new ListItemNode()
        li.id = DOM.GetNodeId(l, n)
        li.childNodes.forEach((
          node: any,
          lin: number
        ) => {
          node.id = DOM.GetNodeId(l, n, lin)
          const item = RenderTextNodeModel(node, l, n, lin)
          listItemNode.child.PushChild(item)
        })
        lineNode.PushChild(listItemNode)
      })
    }
    contentsNode.PushChild(lineNode)
  })
  // MergeNodeInContent(contentsNode)
  return contentsNode
}
