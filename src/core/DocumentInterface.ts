// import { TextNode, TextNodeStyle } from '@/utils/TextNode'
// import { Selection, Position, SetSelection } from '@/utils/Selection'
// import * as Convert from '@/utils/Convert'
// import { TextNodeStateInterface } from '@/components/editor/types/TextNode'
// import { ListStateInterface } from '@/components/editor/types/ListItemNode'
// import { ListType } from './ListItemNode'
// import LineComponent from '@/components/editor/LineComponent'
import { ContentsNode } from '../nodes/ContentsNode'
import { LineNode, LineContent, LineStyle, LineFormate } from '../nodes/LineNode'
import { TextNode, TextNodeStyle ,HyperLinkProp } from '../nodes/TextNode'
import { Selection, Position, SetSelection, SetCursorPosition } from './Selection'
import * as Convert from './Convert'
import { TextNodeStateInterface } from '../types/TextNode'
import { ListStateInterface } from '../types/ListItemNode'
import { ListType, ListItemNode } from '../nodes/ListItemNode'
import { Editor } from '../core/Editor'
import { EmbedNode } from '../nodes/EmbedNode'



export const DocumentToString = (ele: any): string => {
  const parent = document.createElement('div')
  parent.appendChild(ele.cloneNode(true))
  return parent.innerHTML
}

export const GetNodeId = (
  lineIndex: number,
  nodeIndex: number,
  subNodeIndex?: number
): string => {
  return 'l' + lineIndex + 'n' + nodeIndex + (subNodeIndex !== undefined ? 'sn' + subNodeIndex : '')
}

export const GetLineId = (lineIndex: number): string => {
  return 'l' + lineIndex
}

export const IsNodeIdValid = (id: string|undefined) => {
  if (id !== undefined) {
    return id[0] === 'l' && id[2] === 'n'
  } else {
    return false
  }
}

export const IsLineIdValid = (id: string|undefined) => {
  if (id === undefined) {
    return false
  } else {
    const isLenValid = id.length === 2
    const isChar0Valid = (id[0] === 'l')
    const isChar1Valid = !isNaN(parseInt(id[1]))
    return isLenValid &&
      isChar0Valid &&
      isChar1Valid
  }
}

export const GetIndexById = (id: string) => {
  return {
    l: id[1],
    n: id[3],
    sn: id[6]
  }
}

export const GetDOM = (id: string) => {
  return document.getElementById(id)
}

export const View = {
  Root: GetDOM('content')
}

export const isText = (target: any) => {
  return target.nodeType === 3
}

export const ConvertTextToSpan = (target: any, lineIndex: number, nodeIndex: number) => {
  const span = document.createElement('span')
  span.innerText = target.nodeValue
  span.id = GetNodeId(lineIndex, nodeIndex)
  target.replaceWith(span)
}

export const HasStyle = (target: any) => {
  const style = target.style
  if (style === undefined) {
    return false
  } else {
    return target.style.length !== 0
  }
}

export const HasHerf = (target: HTMLElement) => {
  // @ts-ignore
  const herf = target.herf
  return herf !== undefined
}

export const GetStyle = (target: any) => {
  const style = new TextNodeStyle()
  if (target.style.fontSize) {
    style.fontSize = target.style.fontSize
  }
  if (target.style.fontWeight) {
    style.fontWeight = target.style.fontWeight
  }
  if (target.style.color) {
    style.color = target.style.color
  }
  if (target.style.fontFamilty) {
    style.fontFamily = target.style.fontFamily
  }
  if (target.style.backgroundColor) {
    style.backgroundColor = target.style.backgroundColor
  }
  return style
}

export const SetNodeStyle = (
  ele: HTMLElement,
  style: TextNodeStyle
): any => {
  if (ele) {
    for (const key in style) {
      if (key !== 'GetCssText') {
        // @ts-ignore
        ele.style[key] = style[key]
      }
    }
  }
}

export const CloneNewElementByStyle = (
  parentEle: any,
  targetEle: any,
  style: TextNodeStyle
): any => {
  if (parentEle && targetEle) {
    const newEle = document.createElement(targetEle.tag)
    for (const key in style) {
      // @ts-ignore
      newEle.style[key] = style[key]
    }
    parentEle.replaceChild(newEle, targetEle)
  }
}

export const CloneNewTextElement = (
  parentEle: any,
  targetEle: any,
  tag: string,
  value: boolean,
  style: TextNodeStyle
): any => {
  const tags = {
    strong: false,
    em: false,
    s: false,
    u: false
  }
  let ele = targetEle
  while (ele && ele.tagName) {
    for (const t in tags) {
      if (ele.tagName.toLowerCase() === t.toString()) {
        // @ts-ignore
        tags[t] = true
      }
    }
    ele = ele.firstChild
  }
  // @ts-ignore
  tags[tag] = value
  const cEle = document.createElement('span')
  let oEle = cEle
  for (const t in tags) {
    // @ts-ignore
    if (tags[t]) {
      oEle.appendChild(document.createElement(t.toString()))
      // @ts-ignore
      oEle = oEle.firstChild
    }
  }
  oEle.innerText = targetEle.innerText
  let newEle = cEle.firstChild
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  // console.log(newEle.nodeType)
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  if (newEle.nodeType === 1) {
    oEle.innerText = targetEle.innerText
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
  } else if (newEle.nodeType === 3) {
    newEle = cEle
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    newEle.innerText = targetEle.innerText
    // // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // // @ts-ignore
    // newEle.appendChild(document.getElementById('span'))
  }

  if (targetEle.tagName.toLowerCase() === 'a') {
    const n = document.createElement('a')
    const cn = newEle.cloneNode(true)
    n.appendChild(cn)
    newEle = n
    //@ts-ignore
    SetHyperLinkAttribute(newEle, targetEle.href)
  }

  // @ts-ignore
  if (newEle.style !== undefined) {
    for (const s in style) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      newEle.style[s] = style[s]
    }
  }

  return newEle
}

export const SetNodeTag = (
  parentEle: any,
  targetEle: any,
  tag: string,
  value: boolean,
  style: TextNodeStyle
): any => {
  if (targetEle.innerText && targetEle.innerText !== '\n') {
    const newEle = CloneNewTextElement(parentEle, targetEle, tag, value, style)
    // console.log(newEle)

    if (newEle) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      parentEle.replaceChild(newEle, targetEle)
    }
  }
}

export const GetHtmlByTag = (
  tag: string,
  innerHtml: string,
  l: number,
  n: number,
  lin?: number
) => {
  const id = ' id=' + GetNodeId(l, n, lin) + '-' + tag
  return '<' + tag + id + ' >' + innerHtml + '</' + tag + '>'
}

export const SetInnerHTML = (
  node: TextNode,
  l: number,
  n: number,
  lin?: number
): string => {
  let innerText: undefined|string = node.value !== undefined ? node.value : ''
  if (node.tag === 's') {
    if (node.underScore) {
      innerText = GetHtmlByTag('u', innerText, l, n, lin)
      // innerText = '<u id=' + GetNodeId(l, n) + '>' + innerText + '</u>'
    }
  } else if (node.tag === 'em') {
    if (node.underScore) {
      innerText = GetHtmlByTag('u', innerText, l, n, lin)
      // innerText = '<u id=' + GetNodeId(l, n) + '>' + innerText + '</u>'
    }
    if (node.delete) {
      innerText = GetHtmlByTag('s', innerText, l, n, lin)
      // innerText = '<s id=' + GetNodeId(l, n) + '>' + innerText + '</s>'
    }
  } else if (node.tag === 'strong') {
    if (node.underScore) {
      innerText = GetHtmlByTag('u', innerText, l, n, lin)
      // innerText = '<u id=' + GetNodeId(l, n) + '>' + innerText + '</u>'
    }
    if (node.delete) {
      innerText = GetHtmlByTag('s', innerText, l, n, lin)
      // innerText = '<s id=' + GetNodeId(l, n) + '>' + innerText + '</s>'
    }
    if (node.italic) {
      innerText = GetHtmlByTag('em', innerText, l, n, lin)
      // innerText = '<em id=' + GetNodeId(l, n) + '>' + innerText + '</em>'
    }
  } else if (node.tag !== 'strong' &&
    node.tag !== 'em' &&
    node.tag !== 's' &&
    node.tag !== 'u'
  ) {
    if (node.underScore) {
      innerText = GetHtmlByTag('u', innerText, l, n, lin)
      // innerText = '<u id=' + GetNodeId(l, n) + '>' + innerText + '</u>'
    }
    if (node.delete) {
      innerText = GetHtmlByTag('s', innerText, l, n, lin)
      // innerText = '<s id=' + GetNodeId(l, n) + '>' + innerText + '</s>'
    }
    if (node.italic) {
      innerText = GetHtmlByTag('em', innerText, l, n, lin)
      // innerText = '<em id=' + GetNodeId(l, n) + '>' + innerText + '</em>'
    }
    if (node.bold) {
      innerText = GetHtmlByTag('strong', innerText, l, n, lin)
      // innerText = '<strong id=' + GetNodeId(l, n) + '>' + innerText + '</strong>'
    }
  }
  return innerText
}

export const SplitNode = (
  editor: Editor,
  l: number,
  n: number,
  sn: number|undefined,
  o: number
) => {
  const ele = GetDOM(GetNodeId(l, n, sn))
  if (ele) {
    const ne = document.createElement(ele.tagName)
    const pVal = ele.innerText.slice(0, o)
    const nVal = ele.innerText.slice(o)

    if (ele.firstChild?.firstChild) {
      let ope = ele.firstChild
      let one = ne
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      while (ope.tagName) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        one.appendChild(document.createElement(ope.tagName))
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        one = one.firstChild
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        ope = ope.firstChild
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      ope.parentElement.innerText = pVal
      one.innerText = nVal
    } else {
      ele.innerText = pVal
      ne.innerText = nVal
    }

    const style = ele.style.cssText
    if (style) {
      ne.style.cssText = style
    }
    // @ts-ignore
    if (ele.href) {
      // @ts-ignore
      SetHyperLinkAttribute(ne, ele.href)
    }
    ele.insertAdjacentElement('afterend', ne)
  }
}

export const SplitSingleNode = (
  editor: Editor,
  l: number,
  n: number,
  sn: number|undefined,
  so: number,
  eo: number
) => {
  const ele = GetDOM(GetNodeId(l, n, sn))
  // const ele = vm.$el.childNodes[l].childNodes[n]
  if (ele) {
    const me = document.createElement(ele.tagName)
    const ne = document.createElement(ele.tagName)

    const pVal = ele.innerText.slice(0, so)
    const mVal = ele.innerText.slice(so, eo)
    const nVal = ele.innerText.slice(eo)

    if (ele.firstChild?.firstChild) {
      let ope = ele.firstChild
      let ome = me
      let one = ne
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      while (ope.tagName) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        ome.appendChild(document.createElement(ope.tagName))
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        ome = ome.firstChild
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        one.appendChild(document.createElement(ope.tagName))
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        one = one.firstChild
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        ope = ope.firstChild
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      ope.parentElement.innerText = pVal
      ome.innerText = mVal
      one.innerText = nVal
    } else {
      ele.innerText = pVal
      me.innerText = mVal
      ne.innerText = nVal
    }

    // @ts-ignore
    const style = ele.style.cssText
    if (style) {
      me.style.cssText = style
      ne.style.cssText = style
      // SetNodeStyle(me, style)
      // SetNodeStyle(ne, style)
    }

    // @ts-ignore
    if (ele.href) {
      // @ts-ignore
      SetHyperLinkAttribute(me, ele.href)
      // @ts-ignore
      SetHyperLinkAttribute(ne, ele.href)
    }

    ele.insertAdjacentElement('afterend', me)
    me.insertAdjacentElement('afterend', ne)
  }
}

export const UpdateType = {
  Style: 0,
  Tag: 1
}

export const IsTagSame = (
  bEle: any,
  aEle: any
): boolean => {
  let bEleI = bEle
  let aEleI = aEle
  let bTag = bEleI.tagName
  let aTag = aEleI.tagName
  while (bEleI && bTag && aEleI && aTag) {
    if (bEleI.tagName === aEleI.tagName) {
      bEleI = bEleI.firstChild
      aEleI = aEleI.firstChild
      bTag = bEleI.tagName
      aTag = aEleI.tagName
      if (bEleI && !aEleI) {
        return false
      } else if (!bEleI && aEleI) {
        return false
      } else if (bEleI && aEleI) {
        if (bTag && !aTag) {
          return false
        } else if (!bTag && aTag) {
          return false
        }
      }
    } else {
      return false
    }
  }
  return true
}

export const IsStyleSame = (
  bStyle: any,
  aStyle: any
): boolean => {
  const allUndefined = !(bStyle || aStyle)
  if (allUndefined) {
    return true
  } else {
    const bLen = bStyle.length
    const aLen = aStyle.length
    if (bLen !== aLen) {
      return false
    } else {
      if (bLen === 0 && aLen === 0) {
        return true
      } else {
        for (let i = 0; i < bLen; i++) {
          const bKey = bStyle[i]
          const aKey = aStyle[i]
          if (bKey !== aKey) {
            return false
          } else {
            if (bStyle[bKey] !== aStyle[aKey]) {
              return false
            }
          }
        }
        return true
      }
    }
  }
}

export const IsSameNode = (
  bEle: any,
  aEle: any
): boolean => {
  const bStyle = bEle.style
  const aStyle = aEle.style
  if (IsStyleSame(bStyle, aStyle)) {
    return IsTagSame(bEle, aEle)
  } else {
    return false
  }
}

export const SetTextInElement = (
  l: number,
  n: number,
  t: string
): any => {
  const ele = GetDOM(GetNodeId(l, n))
  if (ele) {
    let eI = ele
    while (eI && eI.tagName) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      if (eI.firstChild.tagName) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        eI = eI.firstChild
      } else {
        break
      }
    }
    eI.innerText = t
  }
}

export const MergeNode = (
  l: number,
  n: number
): any => {
  const bEle = GetDOM(GetNodeId(l, n))
  const aEle = bEle?.nextElementSibling
  const parentEle = GetDOM(GetLineId(l))
  if (IsSameNode(bEle, aEle)) {
    const v1 = bEle?.innerText === undefined ? '' : bEle.innerText
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const v2 = aEle?.innerText === undefined ? '' : aEle.innerText
    const newVal = v1 + v2
    SetTextInElement(l, n, newVal)
    if (aEle && parentEle) {
      parentEle.removeChild(aEle)
    }
    return true
  } else {
    return false
  }
}

export const MergeNodeInContent = (
  el: any
): any => {
  el.childNodes.forEach((line: any, l: number) => {
    let n = 0
    while (line.childNodes[n + 1]) {
      const isMerge = MergeNode(l, n)
      if (!isMerge) {
        n++
      }
    }
  })
}

export const UpdateTextNode = (
  param: TextNodeStyle|HyperLinkProp|EmbedNode|string,
  editor: Editor,
  parent: any,
  sn: number,
  en?: number
) => {
  let e
  if (en === undefined) {
    e = parent.childNodes.length
  } else {
    e = en + 1
  }
  for (let i = sn; i < e; i++) {
    if (param instanceof TextNodeStyle) {
      SetNodeStyle(parent.childNodes[i], param)
      setTimeout(() => {
        editor.Update(editor.el)
      }, 0);
    } else if (typeof param === 'string') {
      // console.log('tag')
      const parentEle = parent
      const targetEle = parent.childNodes[i]
      const targetStyle = targetEle?.style
      const style = new TextNodeStyle()
      if (targetStyle) {
        for (let i = 0; i < targetStyle.length; i++) {
          const key = Convert.KebabCaseToCamelCase(targetStyle[i])
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          style[key] = targetStyle[key]
        }
      }
      if (Object.prototype.hasOwnProperty.call(editor.textState, param)) {
        // @ts-ignore
        SetNodeTag(parentEle, targetEle, param, editor.textState[param], style)
        setTimeout(() => {
          editor.Update(editor.el)
        }, 0);
      }
    } else if (param instanceof HyperLinkProp) {
      const parentEle = parent
      const targetEle = parent.childNodes[i]
      SetHyperLink(parentEle, targetEle, param.href)
    }
  }
}

export const UpdateTextDOM = (
  editor: Editor,
  select: Selection,
  param: TextNodeStyle|HyperLinkProp|EmbedNode|string
): any => {
  // type 0 is update style, 1 is update whole node
  if (select.isSelection()) {
    const sl = select.start?.lineIndex
    const sn = select.start?.nodeIndex
    const ssn = select.start?.subNodeIndex
    const so = select.start?.offset
    const el = select.end?.lineIndex
    const en = select.end?.nodeIndex
    const esn = select.end?.subNodeIndex
    const eo = select.end?.offset
    const sp = select.sp
    const ep = select.ep
    if (sl !== undefined &&
      sn !== undefined &&
      el !== undefined &&
      en !== undefined &&
      so !== undefined &&
      eo !== undefined &&
      sp !== undefined &&
      ep !== undefined
    ) {
      // console.log('s', sl, sn, ssn, so, sp)
      // console.log('e', el, en, esn, eo, ep)
      if (sl !== el) {
        console.log('diff-line')
        let scn: number
        let ecn: number
        if (sp === Position.InNode) {
          SplitNode(editor, sl, sn, ssn, so)
          if (ssn !== undefined) {
            scn = ssn + 1
          } else {
            scn = sn + 1
          }
        } else {
          if (ssn !== undefined) {
            scn = ssn
          } else {
            scn = sn
          }
        }
        if (ep === Position.InNode) {
          SplitNode(editor, el, en, esn, eo)
        }
        if (esn !== undefined) {
          ecn = esn
        } else {
          ecn = en
        }

        setTimeout(() => {
          editor.Update(editor.el)
          if (ssn !== undefined) {
            const ListLen = editor.el.childNodes[sl].childNodes.length
            for (let i = sn; i < ListLen; i++) {
              const parent = editor.el.childNodes[sl].childNodes[i]
              if (i === sn) {
                if (sp !== Position.LineEnd) {
                  if (sp === Position.NodeEnd) {
                    UpdateTextNode(param, editor, parent, scn + 1)
                  } else {
                    UpdateTextNode(param, editor, parent, scn)
                  }
                }
              } else {
                UpdateTextNode(param, editor, parent, 0)
              }
            }
          } else {
            const parent = editor.el.childNodes[sl]
            if (sp !== Position.LineEnd) {
              if (sp === Position.NodeEnd) {
                UpdateTextNode(param, editor, parent, scn + 1)
              } else {
                UpdateTextNode(param, editor, parent, scn)
              }
            }
          }

          if (el - sl > 1) {
            for (let i = sl + 1; i < el; i++) {
              // @ts-ignore
              const tag = editor.el.childNodes[i].tagName.toLowerCase()
              if (tag === 'p' || tag === 'div') {
                const parent = editor.el.childNodes[i]
                UpdateTextNode(param, editor, parent, 0)
              } else if (tag === 'ul' || tag === 'ol') {
                const listLen = editor.el.childNodes[i].childNodes.length
                for (let j = 0; j < listLen; j++) {
                  const parent = editor.el.childNodes[i].childNodes[j]
                  UpdateTextNode(param, editor, parent, 0)
                }
              }
            }
          }

          if (esn !== undefined) {
            for (let i = 0; i <= en; i++) {
              const parent = editor.el.childNodes[el].childNodes[i]
              if (i === en) {
                if (ep !== Position.LineStart) {
                  // console.log('e', 'is-node-start', ep === Position.NodeStart)
                  if (ep === Position.NodeStart) {
                    UpdateTextNode(param, editor, parent, 0, ecn - 1)
                  } else {
                    UpdateTextNode(param, editor, parent, 0, ecn)
                  }
                }
              } else {
                UpdateTextNode(param, editor, parent, 0)
              }
            }
          } else {
            const parent = editor.el.childNodes[el]
            if (ep !== Position.LineStart) {
              if (ep === Position.NodeStart) {
                UpdateTextNode(param, editor, parent, 0, ecn - 1)
              } else {
                UpdateTextNode(param, editor, parent, 0, ecn)
              }
            }
          }

          if (ssn !== undefined &&
            esn !== undefined
          ) {
            SetSelection(
              editor,
              sl, sn, scn, sp,
              el, en, ecn, ep
            )
          } else if (ssn === undefined &&
            esn !== undefined
          ) {
            SetSelection(
              editor,
              sl, scn, undefined, sp,
              el, en, ecn, ep
            )
          } else if (ssn !== undefined &&
            esn === undefined
          ) {
            SetSelection(
              editor,
              sl, sn, scn, sp,
              el, ecn, undefined, ep
            )
          } else {
            SetSelection(
              editor,
              sl, scn, undefined, sp,
              el, ecn, undefined, ep
            )
          }
        }, 0)
      } else {
        console.log('same-line-diff-node')
        // console.log('e', el, en, esn)
        if (sn !== en) {
          let scn: number, ecn: number
          if (sp === Position.InNode) {
            SplitNode(editor, sl, sn, ssn, so)
            if (ssn !== undefined) {
              scn = ssn + 1
            } else {
              scn = sn + 1
            }
            if (ep === Position.InNode) {
              SplitNode(editor, el, en, esn, eo)
              if (esn !== undefined) {
                ecn = esn
              } else {
                ecn = en + 1
              }
            } else {
              if (esn !== undefined) {
                ecn = esn
              } else {
                ecn = en + 1
              }
            }
          } else {
            if (ssn !== undefined) {
              scn = ssn
            } else {
              scn = sn
            }
            if (ep === Position.InNode) {
              SplitNode(editor, el, en, esn, eo)
              if (esn !== undefined) {
                ecn = esn
              } else {
                ecn = en
              }
            } else {
              if (esn !== undefined) {
                ecn = esn
              } else {
                ecn = en
              }
            }
          }
          // SetSelection(vm, sl, scn, el, ecn)
          setTimeout(() => {
            editor.Update(editor.el)
            const oscn = scn
            const oecn = ecn
            // @ts-ignore
            const tag = editor.el.childNodes[sl].tagName.toLowerCase()
            if (tag === 'p' || tag === 'div') {
              const parent = editor.el.childNodes[sl]
              if (sp === Position.NodeEnd) {
                scn++
              }
              if (ep === Position.NodeStart) {
                ecn--
              }
              UpdateTextNode(param, editor, parent, scn, ecn)
            } else if (tag === 'ul' || tag === 'ol') {
              for (let i = sn; i <= en; i++) {
                const parent = editor.el.childNodes[sl].childNodes[i]
                if (i === sn) {
                  if (sp !== Position.LineEnd) {
                    if (sp === Position.NodeEnd) {
                      scn++
                    }
                    UpdateTextNode(param, editor, parent, scn)
                  }
                } else if (i === en) {
                  if (ep !== Position.LineStart) {
                    if (ep === Position.NodeStart) {
                      ecn--
                    }
                    // console.log(oecn)
                    UpdateTextNode(param, editor, parent, 0, ecn)
                  }
                } else {
                  UpdateTextNode(param, editor, parent, 0)
                }
              }
            }
            if (ssn !== undefined) {
              SetSelection(editor, sl, sn, oscn, sp, el, en, oecn, ep)
            } else {
              SetSelection(editor, sl, oscn, undefined, sp, el, oecn, undefined, ep)
            }
          }, 0);
        } else {
          console.log('same-line-same-node')
          let scn: number, ecn: number
          if (sp === Position.InNode &&
            ep === Position.InNode
          ) {
            SplitSingleNode(editor, sl, sn, ssn, so, eo)
            if (ssn !== undefined && esn !== undefined) {
              scn = ssn + 1
              ecn = esn + 1
            } else {
              scn = sn + 1
              ecn = en + 1
            }
          } else if (sp !== Position.InNode &&
            ep === Position.InNode
          ) {
            SplitNode(editor, sl, sn, ssn, eo)
            if (ssn !== undefined && esn !== undefined) {
              scn = ssn
              ecn = esn
            } else {
              scn = sn
              ecn = en
            }
          } else if (sp === Position.InNode &&
            ep !== Position.InNode
          ) {
            SplitNode(editor, sl, sn, ssn, so)
            if (ssn !== undefined && esn !== undefined) {
              scn = ssn + 1
              ecn = esn + 1
            } else {
              scn = sn + 1
              ecn = en + 1
            }
          } else {
            if (ssn !== undefined && esn !== undefined) {
              scn = ssn
              ecn = esn
            } else {
              scn = sn
              ecn = en
            }
          }
          if (!(
            ep !== Position.InNode &&
            sp !== Position.InNode)
          ) {
            setTimeout(() => {
              editor.Update(editor.el)
              const oscn = scn
              const oecn = ecn
              // @ts-ignore
              const tag = editor.el.childNodes[sl].tagName.toLowerCase()
              if (tag === 'p' || tag === 'div') {
                const parent = editor.el.childNodes[sl]
                if (sp === Position.NodeEnd) {
                  scn++
                }
                if (ep === Position.NodeStart) {
                  ecn--
                }
                UpdateTextNode(param, editor, parent, scn, ecn)
              } else if (tag === 'ul' || tag === 'ol') {
                for (let i = sn; i <= en; i++) {
                  const parent = editor.el.childNodes[sl].childNodes[i]
                  if (sp === Position.NodeEnd) {
                    scn++
                  }
                  if (ep === Position.NodeStart) {
                    ecn--
                  }
                  UpdateTextNode(param, editor, parent, scn, ecn)
                }
              }
              if (ssn !== undefined) {
                SetSelection(editor, sl, sn, oscn, sp, el, en, oecn, ep)
              } else {
                SetSelection(editor, sl, oscn, undefined, sp, el, oecn, undefined, ep)
              }
            }, 0);
          } else {
            // SetSelection(vm, sl, scn, el, ecn)
            setTimeout(() => {
              editor.Update(editor.el)
              const oscn = scn
              const oecn = ecn
              // @ts-ignore
              const tag = editor.el.childNodes[sl].tagName.toLowerCase()
              if (tag === 'p' || tag === 'div') {
                const parent = editor.el.childNodes[sl]
                if (sp === Position.NodeEnd) {
                  scn++
                }
                if (ep === Position.NodeStart) {
                  ecn--
                }
                UpdateTextNode(param, editor, parent, scn, ecn)
              } else if (tag === 'ul' || tag === 'ol') {
                for (let i = sn; i <= en; i++) {
                  const parent = editor.el.childNodes[sl].childNodes[i]
                  if (sp === Position.NodeEnd) {
                    scn++
                  }
                  if (ep === Position.NodeStart) {
                    ecn--
                  }
                  UpdateTextNode(param, editor, parent, scn, ecn)
                }
              }
              if (ssn !== undefined) {
                SetSelection(editor, sl, sn, oscn, sp, el, en, oecn, ep)
              } else {
                SetSelection(editor, sl, oscn, undefined, sp, el, oecn, undefined, ep)
              }
            }, 0);
          }
        }
      }
    }
  } else {
    const l = select?.anchor?.lineIndex
    const n = select?.anchor?.nodeIndex
    const sn = select?.anchor?.subNodeIndex
    const o = select?.anchor?.offset
    let p
    if (select.anchor) {
      p = Selection.GetPosition(select.anchor)
    }
    if (l !== undefined &&
      n !== undefined &&
      o !== undefined &&
      p !== undefined
    ) {
      if (p === Position.InNode) {
        SplitNode(editor, l, n, sn, o)
      }
      const ele = GetDOM(GetNodeId(l, n, sn))
      let target: HTMLElement
      if (param instanceof HyperLinkProp) {
        target = document.createElement('a')
        target.innerText = param.label
        target.style.cssText = ele.style.cssText
        target.className = ele.className
        SetHyperLinkAttribute(target, param.href)
      } else if (param instanceof TextNodeStyle) {
        target = document.createElement('span')
        target.innerHTML = '&#65279;'
        target.style.cssText = param.GetCssText()
      } else if (typeof param === 'string') {
        target = document.createElement(param)
        target.innerHTML = '&#65279;'
        target.style.cssText = ele.style.cssText
      } else if (param instanceof EmbedNode) {
        target = document.createElement(param.tag)
        // @ts-ignore
        target.src = param.src
        target.style.cssText = param.style.GetCssText()
      }
      if (ele && target) {
        if (p === Position.NodeStart || p === Position.LineStart) {
          ele.insertAdjacentElement('beforebegin', target)
        } else {
          ele.insertAdjacentElement('afterend', target)
        }
        editor.Update(editor.el)
      }
      SetCursorPosition(target)
    }
  }
}

export const GetInnerNode = (
  ele: Node
): Node => {
  let target = ele
  while (target) {
    target = target.firstChild
  }
  return target
}

export const UpdateLineDOM = (
  editor: Editor,
  select: Selection,
  param: LineStyle|LineFormate
): any => {
  let sl = select.start?.lineIndex
  const sp = select.sp
  let el = select.end?.lineIndex
  const ep = select.ep
  if (sl !== undefined &&
    el !== undefined
  ) {
    if (sp === Position.LineEnd &&
      !IsListNode(editor.el.childNodes[sl].childNodes[0])
    ) {
      sl++
    }
    if (ep === Position.LineStart &&
      !IsListNode(editor.el.childNodes[el].childNodes[0])
    ) {
      el--
    }
    if (param instanceof LineStyle) {
      for (let i = sl; i <= el; i++) {
        for (const key in param) {
          // @ts-ignore
          editor.el.childNodes[i].style[key] = param[key]
        }
      }
    } else if (param instanceof LineFormate) {
      for (let i = sl; i <= el; i++) {
        const newChild = document.createElement(param.tag)
        const oldChild = editor.el.childNodes[i]
        if (oldChild instanceof HTMLElement) {
          newChild.innerHTML =oldChild.innerHTML
          if (oldChild.style.cssText) {
            newChild.style.cssText = oldChild.style.cssText
          }
          editor.el.replaceChild(newChild, oldChild)
        }
        for (const key in param.style) {
          // @ts-ignore
          editor.el.childNodes[i].style[key] = param.style[key]
        }
      }
    }
  } else {
    const l = select?.anchor?.lineIndex
    if (l !== undefined) {
      if (param instanceof LineStyle) {
        for (const key in param) {
          // @ts-ignore
          editor.el.childNodes[l].style[key] = param[key]
        }
      } else if (param instanceof LineFormate) {
        const newChild = document.createElement(param.tag)
        const oldChild = editor.el.childNodes[l]
        if (oldChild instanceof HTMLElement) {
          newChild.innerHTML =oldChild.innerHTML
          if (oldChild.style.cssText) {
            newChild.style.cssText = oldChild.style.cssText
          }
          editor.el.replaceChild(newChild, oldChild)
        }
        for (const key in param.style) {
          // @ts-ignore
          editor.el.childNodes[l].style[key] = param.style[key]
        }
      }
    }
  }
}

export const NodeState = (
  ele: any,
  editor: Editor
): TextNodeStateInterface => {
  let e = ele
  const state: TextNodeStateInterface = {
    strong: false,
    em: false,
    s: false,
    u: false
  }
  while (e && e.tagName) {
    const key = e.tagName.toLowerCase()
    const isInState = Object.prototype.hasOwnProperty.call(editor.textState, key)
    if (isInState) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      state[key] = true
    }
    e = e.firstChild
  }
  return state
}

export const IsListNode = (
  ele: any
): boolean => {
  const tag = ele?.tagName.toLocaleLowerCase() !== undefined
    ? ele.tagName.toLocaleLowerCase()
    : ''
  return tag === 'li'
}

export const IsListLine = (
  ele: any
) => {
  const tag = ele?.tagName.toLowerCase()
  return tag === 'ul' || tag === 'ol'
}

export const GetTextNodeState = (
  editor: Editor,
  select: Selection
): any => {
  if (select.start && select.end) {
    const sl = select.start.lineIndex
    const sn = select.start.nodeIndex
    const ssn = select.start.subNodeIndex
    const el = select.end.lineIndex
    const en = select.end.nodeIndex
    const esn = select.end.subNodeIndex
    if (sl !== undefined &&
      sn !== undefined &&
      el !== undefined &&
      en !== undefined
    ) {
      editor.InitTextNodeState()
      const len = GetDOM(GetLineId(sl))?.childNodes.length
      const states: TextNodeStateInterface[] = []
      const listStates: ListStateInterface[] = []
      if (len !== undefined) {
        if (sl !== el) {
          for (let i = sn; i < len; i++) {
            const ele = GetDOM(GetNodeId(sl, i))
            if (ele) {
              const subLen = ele.childNodes.length
              if (IsListNode(ele) && ssn !== undefined && subLen) {
                let start: number
                if (i === sn) {
                  start = ssn
                } else {
                  start = 0
                }
                for (let j = start; j < subLen; j++) {
                  const subEle = GetDOM(GetNodeId(sl, i, j))
                  if (subEle) {
                    states.push(NodeState(subEle, editor))
                  }
                }
              } else {
                states.push(NodeState(ele, editor))
              }
            }
          }
          if (el - sl > 1) {
            for (let i = sl + 1; i < el; i++) {
              const length = GetDOM(GetLineId(i))?.childNodes.length
              if (length) {
                for (let j = 0; j < length; j++) {
                  const ele = GetDOM(GetNodeId(i, j))
                  if (ele) {
                    const subLen = ele.childNodes.length
                    if (IsListNode(ele) && subLen) {
                      for (let k = 0; k < subLen; k++) {
                        const subEle = GetDOM(GetNodeId(i, j, k))
                        if (subEle) {
                          states.push(NodeState(subEle, editor))
                        }
                      }
                    } else {
                      states.push(NodeState(ele, editor))
                    }
                  }
                }
              }
            }
          }
          for (let i = 0; i <= en; i++) {
            const ele = GetDOM(GetNodeId(el, i))
            if (ele) {
              if (IsListNode(ele) && esn !== undefined) {
                let end: number
                if (i === en) {
                  end = esn
                } else {
                  end = ele.childNodes.length
                }
                for (let j = 0; j <= end; j++) {
                  const subEle = GetDOM(GetNodeId(sl, i, j))
                  if (subEle) {
                    states.push(NodeState(subEle, editor))
                  }
                }
              } else {
                states.push(NodeState(ele, editor))
              }
            }
          }
        } else {
          if (sn !== en) {
            for (let i = sn; i <= en; i++) {
              const ele = GetDOM(GetNodeId(sl, i))
              if (ele) {
                if (IsListNode(ele) && ssn !== undefined && esn !== undefined) {
                  const parentTag = ele.parentElement?.tagName.toLocaleLowerCase()
                  listStates.push({
                    type: parentTag === 'ul' ? 0 : 1,
                    list: true
                  })
                  let start: number
                  let end: number
                  const length = ele.childNodes.length
                  if (i === sn) {
                    start = ssn
                    end = length
                  } else if (i === en) {
                    start = 0
                    end = esn + 1
                  } else {
                    start = 0
                    end = length
                  }
                  for (let j = start; j < end; j++) {
                    const subEle = GetDOM(GetNodeId(sl, i, j))
                    if (subEle) {
                      states.push(NodeState(subEle, editor))
                    }
                  }
                } else {
                  states.push(NodeState(ele, editor))
                }
              }
            }
          } else {
            const ele = GetDOM(GetNodeId(sl, sn))
            if (ele) {
              if (IsListNode(ele) && ssn !== undefined && esn !== undefined) {
                for (let i = ssn; i <= esn; i++) {
                  const subEle = GetDOM(GetNodeId(sl, sn, i))
                  if (subEle) {
                    states.push(NodeState(subEle, editor))
                  }
                }
              } else {
                states.push(NodeState(ele, editor))
              }
            }
          }
        }
      }
      states.map((state) => {
        for (const key in state) {
          // @ts-ignore
          if (!state[key]) {
            // @ts-ignore
            editor.textState[key] = false
          }
        }
      })
      for (const key in editor.textState) {
        // @ts-ignore
        editor.textState[key] = !editor.textState[key]
      }
    }
  } else {
    const l = select.anchor?.lineIndex
    const n = select.anchor?.nodeIndex
    const sn = select.anchor?.subNodeIndex
    if (l !== undefined && n !== undefined) {
      const ele = GetDOM(GetNodeId(l, n, sn))
      if (ele) {
        editor.textState = NodeState(ele, editor)
        for (const key in editor.textState) {
          // @ts-ignore
          editor.textState[key] = !editor.textState[key]
        }
      }
    }
  }
}

export const GetListState = (
  editor: Editor,
  select: Selection
): any => {
  editor.InitListState()
  let sl = select.start?.lineIndex
  const sp = select.sp
  let el = select.end?.lineIndex
  const ep = select.ep
  if (sl !== undefined &&
    el !== undefined
  ) {
    const listStates: ListStateInterface[] = []
    if (sp === Position.LineEnd &&
      !IsListNode(editor.el.childNodes[sl].childNodes[0])
    ) {
      sl++
    }
    if (ep === Position.LineStart &&
      !IsListNode(editor.el.childNodes[el].childNodes[0])
    ) {
      el--
    }
    for (let i = sl; i <= el; i++) {
      // @ts-ignore
      const tag = editor.el.childNodes[i].tagName.toLowerCase()
      if (tag === 'ul' || tag === 'ol') {
        listStates.push({
          list: true
        })
      } else {
        listStates.push({
          list: false
        })
      }
    }
    {
      let i = 0
      while (listStates[i]) {
        if (!listStates[i].list) {
          editor.listState.list = false
          break
        }
        i++
      }
    }
  } else {
    let l = select.anchor?.lineIndex
    if (l !== undefined) {
      // @ts-ignore
      const tag = editor.el.childNodes[l].tagName.toLowerCase()
      if (tag === 'ul' || tag === 'ol') {
        editor.listState = {list: true}
      } else {
        editor.listState = {list: false}
      }
    }
  }
}

export const GetLineStyle = (
  editor: Editor,
  select: Selection
): any => {
  let sl = select.start?.lineIndex
  const sp = select.sp
  let el = select.end?.lineIndex
  const ep = select.ep
  if (sl !== undefined && el !== undefined) {
    const lineStyles: LineStyle[] = []
    if (sp === Position.LineEnd &&
      !IsListNode(editor.el.childNodes[sl].childNodes[0])
    ) {
      sl++
    }
    if (ep === Position.LineStart &&
      !IsListNode(editor.el.childNodes[el].childNodes[0])
    ) {
      el--
    }
    for (let i = sl; i <= el; i++) {
      // @ts-ignore
      const align = editor.el.childNodes[i].style['text-align']
      const lineStyle = new LineStyle()
      lineStyle.SetTextAlign(align)
      lineStyles.push(lineStyle)
    }
    if (lineStyles.length > 1) {
      let i = 0
      editor.lineStyle = new LineStyle()
      while (lineStyles[i]) {
        if (lineStyles[i].GetCssText() === '') {
          editor.lineStyle = new LineStyle()
          break
        } else {
          if (i > 0) {
            const pStyle = lineStyles[i - 1]
            const style = lineStyles[i]
            if (pStyle.GetTextAlign() === style.GetTextAlign()) {
              editor.lineStyle.SetTextAlign(style.GetTextAlign())
            }
          }
        }
      }
    } else {
      editor.lineStyle = lineStyles[0]
    }
  } else {
    const l = select.anchor?.lineIndex
    if (l !== undefined) {
      // @ts-ignore
      const align = editor.el.childNodes[l].style['text-align']
      const style = new LineStyle()
      style.SetTextAlign(align)
      editor.lineStyle = style
    }
  }
}

export const IsListTypeChange = (
  line: any,
  param: ListStateInterface
): any => {
  const type = param.type
  if (type !== undefined) {
    const case1 = line.tagName === 'ul' && type === ListType.Sort
    const case2 = line.tagName === 'ol' && type === ListType.NoSort
    return case1 || case2
  }
}

export const RemoveEmptyLine = (
  el: any
): any => {
  let i = 0
  let child = el.childNodes[i]
  while (child) {
    if (child.childNodes.length === 0) {
      el.removeChild(child)
    } else {
      i++
    }
    child = el.childNodes[i]
  }
}

export const UpdateListDOM = (
  editor: Editor,
  select: Selection,
  param: ListStateInterface
): any => {
  if (param.list && param.type !== undefined) {
    if (select.isSelection()) {
      let sl = select.start?.lineIndex
      let el = select.end?.lineIndex
      let sn = select.start?.nodeIndex
      let en = select.end?.nodeIndex
      const sp = select.sp
      const ep = select.ep
      if (sl !== undefined &&
        sn !== undefined &&
        el !== undefined &&
        en !== undefined &&
        sp !== undefined &&
        ep !== undefined
      ) {
        const startLine = editor.el.childNodes[sl]
        if (sp === Position.LineEnd) {
          if (IsListLine(startLine)) {
            if (sn < startLine.childNodes.length - 1) {
              sn++
            } else {
              sl++
              sn = 0
            }
          }
        }
        const endLine = editor.el.childNodes[el]
        if (ep === Position.LineStart) {
          if (IsListLine(startLine)) {
            if (en > 0) {
              en--
            } else {
              el++
              en = editor.el.childNodes[el].childNodes.length - 1
            }
          }
        }
        const pLine = startLine
        const nLine = endLine
        let newList
        let afterNewList
        if (param.type === ListType.NoSort) {
          newList = document.createElement('ul')
        } else if (param.type === ListType.Sort) {
          newList = document.createElement('ol')
        } else {
          newList = document.createElement('ul')
        }
        if (param.symbol !== undefined) {
          newList.style.listStyleType = param.symbol
        }
        for (let i = sl; i <= el; i++) {
          const line = GetDOM(GetLineId(i))
          if (line) {
            newList.className = line.className
            if (IsListLine(line)) {
              const lineLen = line.childNodes.length
              let start: number, end: number
              if (el !== sl) {
                if (i === sl) {
                  start = sn
                  end = lineLen - 1
                } else if (i === el) {
                  start = 0
                  end = en
                } else {
                  start = 0
                  end = lineLen - 1
                }
              } else {
                start = sn
                end = en
              }
              for (let j = start; j <= end; j++) {
                const listItem = GetDOM(GetNodeId(i, j))
                if (listItem) {
                  newList.appendChild(listItem)
                }
              }
              if (end !== lineLen - 1) {
                afterNewList = document.createElement(line.tagName)
                afterNewList.className = line.className
                for (let j = end + 1; j < lineLen; j++) {
                  const listItem = GetDOM(GetNodeId(i, j))
                  if (listItem) {
                    afterNewList.appendChild(listItem)
                  }
                }
              }
            } else {
              const newLine = document.createElement('li')
              newLine.className = line.className
              let child = line.childNodes[0]
              while (child) {
                newLine.appendChild(child)
                child = line.childNodes[0]
              }
              newList.appendChild(newLine)
            }
          }
        }

        if (pLine) {
          // @ts-ignore
          pLine.insertAdjacentElement('afterend', newList)
          if (pLine.childNodes.length === 0) {
            const root = GetDOM('content')
            if (root) {
              root.removeChild(pLine)
            }
          }

          if (afterNewList) {
            newList.insertAdjacentElement('afterend', afterNewList)
          }
        } else {
          // @ts-ignore
          nLine.insertAdjacentElement('beforebegin', newList)
          console.log('beforeend')
          if (afterNewList) {
            newList.insertAdjacentElement('afterend', afterNewList)
          }
        }
      }
    } else {
      const l = select.anchor?.lineIndex
      const n = select.anchor?.nodeIndex
      if (l !== undefined && n !== undefined) {
        const line = GetDOM(GetLineId(l))
        if (line) {
          if (IsListLine(line)) {
            if (IsListTypeChange(line, param)) {
              // change list root tag
              let newList
              if (param.type === ListType.NoSort) {
                newList = document.createElement('ul')
              } else if (param.type === ListType.Sort) {
                newList = document.createElement('ol')
              } else {
                newList = document.createElement('ul')
              }
              const newLine = document.createElement('li')
              newList.className = line.className
              let child = line.childNodes[0]
              while (child) {
                newLine.appendChild(child)
                child = line.childNodes[0]
              }
              const pLine = line.previousElementSibling
              const nLine = line.nextElementSibling
              newList.appendChild(newLine)
              if (pLine) {
                pLine.insertAdjacentElement('afterend', newList)
              } else {
                if (nLine) {
                  nLine.insertAdjacentElement('beforebegin', newList)
                } else {
                  const root = GetDOM('content')
                  if (root) {
                    root.appendChild(newList)
                    const pEle = newList.previousElementSibling
                    if (pEle && pEle.childNodes.length === 0) {
                      root.removeChild(pEle)
                    }
                  }
                }
              }
            } else {
              // change pseudo element
              if (param.symbol !== undefined) {
                if (line.style.listStyleType) {
                  line.style.listStyleType = ''
                }
                line.style.listStyleType = param.symbol
              }
            }
          } else {
            // set normal line to list
            let newList
            if (param.type === ListType.NoSort) {
              newList = document.createElement('ul')
            } else if (param.type === ListType.Sort) {
              newList = document.createElement('ol')
            } else {
              newList = document.createElement('ul')
            }
            if (param.symbol !== undefined) {
              newList.style.listStyleType = param.symbol
            }
            const newLine = document.createElement('li')
            newList.className = line.className
            let child = line.childNodes[0]
            while (child) {
              newLine.appendChild(child)
              child = line.childNodes[0]
            }
            const pLine = line.previousElementSibling
            const nLine = line.nextElementSibling
            newList.appendChild(newLine)
            if (pLine) {
              pLine.insertAdjacentElement('afterend', newList)
            } else {
              if (nLine) {
                nLine.insertAdjacentElement('beforebegin', newList)
              } else {
                const root = GetDOM('content')
                if (root) {
                  root.appendChild(newList)
                  const pEle = newList.previousElementSibling
                  if (pEle && pEle.childNodes.length === 0) {
                    root.removeChild(pEle)
                  }
                }
              }
            }
          }
        }
      }
    }
  } else if (!param.list && param.type === undefined) {
    if (select.isSelection()) {
      let sl = select.start?.lineIndex
      let el = select.end?.lineIndex
      let sn = select.start?.nodeIndex
      let en = select.end?.nodeIndex
      const sp = select.sp
      const ep = select.ep
      if (sl !== undefined &&
        sn !== undefined &&
        el !== undefined &&
        en !== undefined &&
        sp !== undefined &&
        ep !== undefined
      ) {
        const startLine = editor.el.childNodes[sl]
        if (sp === Position.LineEnd) {
          if (IsListLine(startLine)) {
            if (sn < startLine.childNodes.length - 1) {
              sn++
            } else {
              sl++
              sn = 0
            }
          }
        }
        const endLine = editor.el.childNodes[el]
        if (ep === Position.LineStart) {
          if (IsListLine(startLine)) {
            if (en > 0) {
              en--
            } else {
              el++
              en = editor.el.childNodes[el].childNodes.length - 1
            }
          }
        }
        let pLine = startLine
        const nLine = endLine
        const c = document.createElement('div')
        for (let i = sl; i <= el; i++) {
          const line = GetDOM(GetLineId(i))
          const className = line?.className
          if (line && IsListLine(line)) {
            const lineLen = line.childNodes.length
            let start: number, end: number
            if (el !== sl) {
              if (i === sl) {
                start = sn
                end = lineLen - 1
              } else if (i === el) {
                start = 0
                end = en
              } else {
                start = 0
                end = lineLen - 1
              }
            } else {
              start = sn
              end = en
            }
            for (let j = start; j <= end; j++) {
              const listItem = GetDOM(GetNodeId(i, j))
              if (listItem) {
                c.appendChild(listItem)
                const newLine = document.createElement('p')
                newLine.className = className === undefined ? '' : className
                let child = listItem.childNodes[0]
                while (child) {
                  newLine.appendChild(child)
                  child = listItem.childNodes[0]
                }
                c.removeChild(listItem)
                c.appendChild(newLine)
              }
            }
            let afterNewList
            if (end !== lineLen - 1) {
              afterNewList = document.createElement(line.tagName)
              for (let j = end + 1; j < lineLen; j++) {
                const listItem = GetDOM(GetNodeId(i, j))
                if (listItem) {
                  afterNewList.appendChild(listItem)
                  afterNewList.className = line.className
                }
              }
            }
            let insertLine = c.childNodes[0]
            if (pLine) {
              while (insertLine) {
                // @ts-ignore
                pLine.insertAdjacentElement('afterend', insertLine)
                pLine = insertLine
                insertLine = c.childNodes[0]
              }

              if (afterNewList) {
                // @ts-ignore
                pLine.insertAdjacentElement('afterend', afterNewList)
              }
            } else {
              // @ts-ignore
              nLine.insertAdjacentElement('beforebegin', insertLine)
              if (afterNewList) {
                // @ts-ignore
                nLine.insertAdjacentElement('afterend', afterNewList)
              }
            }
          }
        }
      }
    } else {
      const l = select.anchor?.lineIndex
      const n = select.anchor?.nodeIndex
      if (l !== undefined && n !== undefined) {
        const line = GetDOM(GetLineId(l))
        if (line && IsListLine(line)) {
          const c = document.createElement('div')
          const rows = line.childNodes.length
          const newLine = document.createElement('p')
          const afterList = document.createElement(line.tagName)
          afterList.className = line.className
          for (let i = n; i < rows; i++) {
            const removeLine = GetDOM(GetNodeId(l, i))
            if (removeLine) {
              newLine.className = line.className
              if (i === n) {
                c.appendChild(removeLine)
                let child = removeLine.childNodes[0]
                while (child) {
                  newLine.appendChild(child)
                  child = removeLine.childNodes[0]
                }
              } else {
                afterList.appendChild(removeLine)
              }
            }
          }

          const pLine = line
          const nLine = line.nextElementSibling

          if (pLine) {
            pLine.insertAdjacentElement('afterend', newLine)
            if (afterList) {
              newLine.insertAdjacentElement('afterend', afterList)
            }
          } else {
            if (nLine) {
              nLine.insertAdjacentElement('beforebegin', newLine)
              if (afterList) {
                newLine.insertAdjacentElement('afterend', afterList)
              }
            } else {
              const root = GetDOM('content')
              if (root) {
                root.appendChild(newLine)
                const pEle = newLine.previousElementSibling
                if (pEle && pEle.childNodes.length === 0) {
                  root.removeChild(pEle)
                }
                if (afterList) {
                  newLine.insertAdjacentElement('afterend', afterList)
                }
              }
            }
          }
        }
      }
    }
  }
  RemoveEmptyLine(editor.el)
  setTimeout(() => {
    editor.Update(editor.el)
  }, 0)
}

export const RenderTextNode = (
  node: TextNode,
  l: number,
  n: number,
  sn?: number
): HTMLElement => {
  const ele = document.createElement(node.tag)
  ele.id = GetNodeId(l, n, sn)
  ele.innerHTML = SetInnerHTML(node, l, n, sn)
  if (node.style !== undefined) {
    ele.style.cssText = node.style.GetCssText()
  }
  return ele
}

export const Redirect = (
  e: Event
) => {
  let target = e.target
  // @ts-ignore
  while(target.href === undefined) {
    // @ts-ignore
    target = target.parentElement
  }
  // @ts-ignore
  if (target.href) {
    // @ts-ignore
    window.open(target.href)
  }
}

export const SetHyperLinkAttribute = (
  ele: HTMLElement,
  href: string|undefined
): any => {
  if (href) {
    ele.setAttribute('href', href)

    ele.style.cursor = 'Pointer'
    // @ts-ignore
    ele.target = '_blank'
    // @ts-ignore
    ele.rel = 'noopener noreferrer nofollow'

    ele.onclick = Redirect
  }
}

export const SetHyperLink = (
  parent: HTMLElement,
  ele: HTMLElement,
  href: string
): any => {
  if (ele) {
    const tag = ele.tagName.toLowerCase()
    if (tag !== 'a') {
      let hyperLink
      if (tag === 'strong' ||
        tag === 'em' ||
        tag === 's' ||
        tag === 'u'
      ) {
        hyperLink = document.createElement('a')
        hyperLink.style.cssText = ele.style.cssText
        ele.style.cssText = ''
        const cloneEle = ele.cloneNode(true)
        hyperLink.appendChild(cloneEle)
        SetHyperLinkAttribute(hyperLink, href)
      } else if (
        tag === 'span'
      ) {
        hyperLink = document.createElement('a')
        hyperLink.style.cssText = ele.style.cssText
        hyperLink.innerHTML = ele.innerHTML
        SetHyperLinkAttribute(hyperLink, href)
      }
      if (hyperLink) {
        parent.replaceChild(hyperLink, ele)
      }
    }
  }
}

export const Render = (c: ContentsNode): HTMLElement[] => {
  const ele: HTMLElement[] = []

  c.children.map((
    line: LineNode,
    l: number
  ) => {
    const newLine = document.createElement(line.tag)
    newLine.id = GetLineId(l)
    if (line.style.GetCssText().length > 0) {
      newLine.style.cssText = line.style.GetCssText()
    }
    newLine.className = 'editor-row hide-outline'
    line.children.map((
      lc: LineContent,
      n: number
    ) => {
      const child = lc.child
      const cEle = document.createElement(child.tag)
      cEle.id = GetNodeId(l, n)
      if (child instanceof TextNode) {
        SetHyperLinkAttribute(cEle, child?.href)
        cEle.innerHTML = SetInnerHTML(child, l, n)
        if (child.style !== undefined) {
          cEle.style.cssText = child.style.GetCssText()
        }
      } else if (child instanceof ListItemNode) {
        child.child.children.map((listItem: LineContent, sn: number) => {
          const liChild = listItem.child
          if (liChild instanceof TextNode) {
            const liEle = document.createElement(liChild.tag)
            SetHyperLinkAttribute(liEle, liChild?.href)
            liEle.id = GetNodeId(l, n, sn)
            liEle.innerHTML = SetInnerHTML(liChild, l, n, sn)
            if (liChild.style !== undefined) {
              liEle.style.cssText = liChild.style.GetCssText()
            }
            cEle.appendChild(liEle)
          }
        })
      } else if (child instanceof EmbedNode) {
        // @ts-ignore
        cEle.src = child.src
        // @ts-ignore
        cEle.type = child.type
        cEle.style.cssText = child.style.GetCssText()
      }
      newLine.appendChild(cEle)
    })
    ele.push(newLine)
  })

  return ele
}

export const InitEditor = (
  el: HTMLElement,
  editor: Editor
) => {
  if (el !== undefined) {
    el.classList.add('content')
    el.classList.add('hide-outline')
    el.id = 'content'
    el.contentEditable = 'true'
    el.spellcheck = false
    el.addEventListener('blur', () => {
      editor.Update(el)
      editor.InitTextNodeState()
    })
    el.addEventListener('dragend', () => {
      editor.Update(el)
    })
    el.addEventListener('mouseup', (e) => {
      const select = new Selection()
      GetTextNodeState(editor, select)
      GetListState(editor, select)
      GetLineStyle(editor, select)
    })
    editor.InitTextNodeState()
    editor.InitListState()
    RemoveAllChild(el)
  }
}

export const RemoveAllChild = (
  el: HTMLElement
): any => {
  let child = el.childNodes[0]
  while (child) {
    el.removeChild(child)
    child = el.childNodes[0]
  }
}
