import { TextNodeStyle, TextNode } from "../nodes/TextNode"
import { LineNode } from "../nodes/LineNode"
import { ListItemNode } from "../nodes/ListItemNode"
import { ContentsNode } from "../nodes/ContentsNode"
import * as DOM from "../core/DocumentInterface"
import * as Model from "../core/Model"
import { TextNodeStateInterface } from "../types/TextNode"
import { ListStateInterface } from "../types/ListItemNode"
import { Selection } from "./Selection"

export class Editor {
  public VirtualDom: ContentsNode
  public textState: TextNodeStateInterface
  public listState: ListStateInterface
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

  public InitTextNodeState = (
  ): any => {
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

  public SetBold () {
    const select = new Selection()
    const bold = 'strong'
    // console.log(select)
    DOM.UpdateTextDOM(this, select, bold)
    // console.log(new Selection())
  }

  public SetItalic () {
    const select = new Selection()
    const italic = 'em'
    // console.log(select)
    DOM.UpdateTextDOM(this, select, italic)
    // console.log(new Selection())
  }

  public SetDelete () {
    const select = new Selection()
    const del = 's'
    // console.log(select)
    DOM.UpdateTextDOM(this, select, del)
    // console.log(new Selection())
  }
  
  public SetUnderScore () {
    const select = new Selection()
    const underScore = 'u'
    // console.log(select)
    DOM.UpdateTextDOM(this, select, underScore)
    // console.log(new Selection())
  }

  public SetList (
    param: ListStateInterface
  ) {
    const select = new Selection()
    DOM.UpdateListDOM(this, select, param)
  }
}