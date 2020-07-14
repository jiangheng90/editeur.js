// import { SelectionInterface, SelectionNodeInterface } from '@/components/editor/types/Selection'
// import * as DOM from '@/utils/DocumentInterface'
import { SelectionInterface, SelectionNodeInterface } from '../types/Selection'
import * as DOM from './DocumentInterface'
import { Editor } from '..'

export const Position = {
  InNode: 0,
  NodeStart: 1,
  NodeEnd: 2,
  LineStart: 3,
  LineEnd: 4
}

export class SelectionNode implements SelectionNodeInterface {
  public lineIndex: number | undefined
  public nodeIndex: number | undefined
  public subNodeIndex: number | undefined
  public offset: number

  constructor (elementId: string, offset: number) {
    if (elementId) {
      const id = DOM.GetIndexById(elementId)
      this.lineIndex = parseInt(id.l)
      this.nodeIndex = parseInt(id.n)
      this.subNodeIndex = isNaN(parseInt(id.sn)) ? undefined : parseInt(id.sn)
    } else {
      this.lineIndex = undefined
      this.nodeIndex = undefined
      this.subNodeIndex = undefined
    }

    this.offset = offset
  }
}

const InitSelectionNode = (
  node: any,
  offset: number
): SelectionNode|undefined => {
  const oId = node?.parentElement?.id
  if (oId !== undefined) {
    if (DOM.IsNodeIdValid(oId)) {
      const tag = node.parentElement.tagName.toLocaleLowerCase()
      if (tag === 'li') {
        const id = node.id
        return new SelectionNode(id, offset)
      } else {
        return new SelectionNode(oId, offset)
      }
    } else if (oId === 'content') {
      const t = node.childNodes[offset]
      if (t) {
        let id = t.id
        // console.log(id)
        if (id !== undefined) {
          if (DOM.IsNodeIdValid(id)) {
            return new SelectionNode(id, 0)
          } else {
            id = node.childNodes[0].id
            if (DOM.IsNodeIdValid(id)) {
              return new SelectionNode(id, 0)
            }
          }
        }
      }
    } else if (DOM.IsLineIdValid(oId)) {
      let id = node.id
      if (id) {
        const tag = DOM.GetDOM(id)?.tagName.toLocaleLowerCase()
        if (tag === 'li') {
          id = node.childNodes[0].id
        }
        return new SelectionNode(id, offset)
      } else {
        id = node.parentElement.childNodes[offset].id
      }
    }
  }
}

export class Selection implements SelectionInterface {
  anchor: SelectionNode | undefined
  focus: SelectionNode | undefined
  start: SelectionNode | undefined
  end: SelectionNode | undefined
  sp: number | undefined
  ep: number | undefined

  private readonly select: any|undefined

  constructor () {
    this.select = window.getSelection()
    this.anchor = InitSelectionNode(
      this.select.anchorNode,
      this.select.anchorOffset
    )
    this.focus = InitSelectionNode(
      this.select.focusNode,
      this.select.focusOffset
    )
    this.SortNodes()
  }

  public isSelection (): boolean {
    return !(this.select?.anchorNode === this.select?.focusNode &&
      this.select?.anchorOffset === this.select?.focusOffset)
  }

  private SortNodes (): any {
    if (this.anchor !== undefined &&
      this.focus !== undefined
    ) {
      if (this.isSelection()) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        if (this.anchor.lineIndex === this.focus.lineIndex) {
          if (this.anchor.nodeIndex === this.focus.nodeIndex) {
            if (this.anchor.offset > this.focus.offset) {
              this.start = this.focus
              this.end = this.anchor
            } else {
              this.start = this.anchor
              this.end = this.focus
            }
          } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            if (this.anchor.nodeIndex > this.focus.nodeIndex) {
              this.start = this.focus
              this.end = this.anchor
            } else {
              this.start = this.anchor
              this.end = this.focus
            }
          }
        } else {
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          if (this.anchor.lineIndex > this.focus.lineIndex) {
            this.start = this.focus
            this.end = this.anchor
          } else {
            this.start = this.anchor
            this.end = this.focus
          }
        }
        this.sp = Selection.GetPosition(this.start)
        this.ep = Selection.GetPosition(this.end)
      } else {
        this.start = undefined
        this.end = undefined
      }
    }
  }

  public static GetPosition (sn: SelectionNode): any {
    const l = sn.lineIndex
    const n = sn.nodeIndex
    const subN = sn.subNodeIndex
    const o = sn.offset
    if (l !== undefined &&
      n !== undefined
    ) {
      const nodeLength = DOM.GetDOM(DOM.GetNodeId(l, n))?.innerText.length
      const lineLength = DOM.GetDOM(DOM.GetLineId(l))?.childNodes.length
      const listLength = DOM.GetDOM(DOM.GetNodeId(l, n))?.childNodes.length
      const subnodeLength = DOM.GetDOM(DOM.GetNodeId(l, n, subN))?.innerText.length
      if (subN === undefined) {
        if (nodeLength !== undefined &&
          lineLength !== undefined
        ) {
          if (o === 0) {
            if (n === 0) {
              // console.log('line-start')
              return Position.LineStart
            } else {
              // console.log('node-start')
              return Position.NodeStart
            }
          } else if (o === nodeLength) {
            if (n === lineLength - 1) {
              // console.log('line-end')
              return Position.LineEnd
            } else {
              // console.log('node-end')
              return Position.NodeEnd
            }
          } else {
            // console.log('in-node')
            return Position.InNode
          }
        }
      } else {
        if (subnodeLength !== undefined &&
          listLength !== undefined &&
          nodeLength !== undefined &&
          lineLength !== undefined
        ) {
          if (o === 0) {
            if (subN === 0) {
              // console.log('line-start')
              return Position.LineStart
            } else {
              // console.log('node-start')
              return Position.NodeStart
            }
          } else if (o === subnodeLength) {
            if (subN === listLength - 1) {
              // console.log('line-end')
              return Position.LineEnd
            } else {
              // console.log('node-end')
              return Position.NodeEnd
            }
          } else {
            // console.log('sub-in-node')
            return Position.InNode
          }
        }
      }
    }
  }
}

export const SetSelection = (
  editor: Editor,
  sl: number,
  sn: number,
  ssn: number|undefined,
  sp: number,
  el: number,
  en: number,
  esn: number|undefined,
  ep: number
) => {
  let start
  if (ssn !== undefined) {
    if (sp === Position.NodeEnd) {
      ssn++
    } else if (sp === Position.LineEnd) {
      sn++
    }
    start = editor.el.childNodes[sl].childNodes[sn].childNodes[ssn]
  } else {
    if (sp === Position.NodeEnd) {
      sn++
    } else if (sp === Position.LineEnd) {
      sl++
      sn = 0
    }
    start = editor.el.childNodes[sl].childNodes[sn]
    // @ts-ignore
    const tag = start.tagName.toLocaleLowerCase()
    if (tag === 'li') {
      start = editor.el.childNodes[sl].childNodes[sn].childNodes[0]
    }
  }
  while (start.childNodes[0]) {
    start = start.childNodes[0]
  }
  let end
  if (esn !== undefined) {
    if (ep === Position.NodeStart) {
      esn--
    } else if (ep === Position.LineStart) {
      en--
    }
    end = editor.el.childNodes[el].childNodes[en].childNodes[esn]
  } else {
    if (ep === Position.NodeStart) {
      en--
    } else if (ep === Position.LineStart) {
      el--
      en = editor.el.childNodes[el].childNodes.length - 1
    }
    end = editor.el.childNodes[el].childNodes[en]
  }
  while (end.childNodes[0]) {
    end = end.childNodes[0]
  }
  if (start && end) {
    const range = document.createRange()
    range.setStart(start, 0)
    // @ts-ignore
    range.setEnd(end, end.length)
    const select = window.getSelection()
    if (select) {
      select.removeAllRanges()
      select.addRange(range)
    }
  }
}

export const SetCursorPosition = (
  ele: HTMLElement
): any => {
  if (ele) {
    const range = document.createRange()
    const select = window.getSelection()
    if (select) {
      range.selectNode(ele)
      range.collapse(false)
      select.removeAllRanges()
      select.addRange(range)
    }
  }
}