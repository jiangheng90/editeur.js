import { TextNodeStyle, TextNode, HyperLinkProp } from "../nodes/TextNode"
import { LineNode, LineStyle, LineFormate } from "../nodes/LineNode"
import { ListItemNode } from "../nodes/ListItemNode"
import { ContentsNode } from "../nodes/ContentsNode"
import * as DOM from "../core/DocumentInterface"
import * as Model from "../core/Model"
import { TextNodeStateInterface } from "../types/TextNode"
import { ListStateInterface } from "../types/ListItemNode"
import { Selection } from "./Selection"
import { EmbedNode } from "../nodes/EmbedNode"

export class Editor {
  public VirtualDom: ContentsNode
  public textState: TextNodeStateInterface
  public listState: ListStateInterface
  public lineStyle: LineStyle
  public el: HTMLElement
  constructor(el: HTMLElement, content?: ContentsNode) {
    DOM.InitEditor(el, this)
    content = Model.InitModel(content)
    this.VirtualDom = content
    this.el = el
    DOM.Render(content).map((
      line: HTMLElement
    ) => {
      el.append(line)
    })
  }

  public Update = (
    el: HTMLElement
  ) => {
    this.VirtualDom = Model.RenderModel(el)
  }

  public InitTextNodeState = (): any => {
    this.textState = {
      strong: true,
      em: true,
      s: true,
      u: true
    }
  }

  public InitListState (): any {
    this.listState = {
      list: true
    }
  }

  public SetTextStyle (
    val: TextNodeStyle
  ): any {
    const select = new Selection()
    const textStyle = val
    DOM.UpdateTextDOM(this, select, textStyle)
  }

  public SetFontFamily (
    val: string
  ): any {
    const select = new Selection()
    const textStyle = new TextNodeStyle()
    const fontFamily = val
    textStyle.fontFamily = fontFamily
    DOM.UpdateTextDOM(this, select, textStyle)
  }

  public SetFontSize (
    val: number,
    type?: number
  ): any {
    const select = new Selection()
    let size
    if (type === 0) {
      size = val + 'px'
    } else if (type === 1) {
      size = val + 'pt'
    } else if (type === 2) {
      size = val + '%'
    } else {
      size = val + 'px'
    }
    // console.log(select)
    const textStyle = new TextNodeStyle(size)
    DOM.UpdateTextDOM(this, select, textStyle)
    // console.log(new Selection())
  }

  public SetFontColor (val: string) {
    const select = new Selection()
    const color = val
    const textStyle = new TextNodeStyle()
    textStyle.color = color
    // console.log(select)
    DOM.UpdateTextDOM(this, select, textStyle)
    // console.log(new Selection())
  }

  public SetBackgroundColor (val: string) {
    const select = new Selection()
    const color = val
    const textStyle = new TextNodeStyle()
    textStyle.backgroundColor = color
    // console.log(select)
    DOM.UpdateTextDOM(this, select, textStyle)
    // console.log(new Selection())
  }

  public InsertEmbedElement (val: EmbedNode) {
    const select = new Selection()
    DOM.UpdateTextDOM(this, select, val)
  }

  public SetBold () {
    const select = new Selection()
    const bold = 'strong'
    // console.log(select)
    DOM.UpdateTextDOM(this, select, bold)
    DOM.GetTextNodeState(this, select)
    // console.log(new Selection())
  }

  public SetItalic () {
    const select = new Selection()
    const italic = 'em'
    // console.log(select)
    DOM.UpdateTextDOM(this, select, italic)
    DOM.GetTextNodeState(this, select)
    // console.log(new Selection())
  }

  public SetDelete () {
    const select = new Selection()
    const del = 's'
    // console.log(select)
    DOM.UpdateTextDOM(this, select, del)
    DOM.GetTextNodeState(this, select)
    // console.log(new Selection())
  }
  
  public SetUnderScore () {
    const select = new Selection()
    const underScore = 'u'
    // console.log(select)
    DOM.UpdateTextDOM(this, select, underScore)
    DOM.GetTextNodeState(this, select)
    // console.log(new Selection())
  }

  public SetHyperLink (
    href: string,
    label?: string
  ) {
    const select = new Selection()
    let param: HyperLinkProp
    if (label !== undefined) {
      param = new HyperLinkProp(href, label)
    } else {
      param = new HyperLinkProp(href)
    }
    DOM.UpdateTextDOM(this, select, param)
  }

  public SetList (
    param: ListStateInterface
  ) {
    const select = new Selection()
    DOM.UpdateListDOM(this, select, param)
  }

  public SetAlign (
    val: LineStyle
  ): any {
    const select = new Selection()
    DOM.UpdateLineDOM(this, select, val)
  }

  public SetLineStyle (
    val: LineStyle|LineFormate
  ): any {
    const select = new Selection()
    DOM.UpdateLineDOM(this, select, val)
  }
}