// import { LineContentInterface, LineNodeInterface } from '@/components/editor/types/LineNode'
// import { TextNode } from '@/utils/TextNode'
import { LineContentInterface, LineNodeInterface, LineStyleInterface, LineFormateInterface } from '../types/LineNode'
import { TextNode } from './TextNode'
import { ListItemNode } from './ListItemNode'
import { EmbedNodeStyle, EmbedNode } from './EmbedNode'

export class LineStyle implements LineStyleInterface {
  private textAlign: string
  public lineHeigth: string
  public borderLeft: string
  public color: string
  public backgroundColor: string
  public padding: string
  public fontSize: string
  public fontWeight: string

  public SetTextAlign (val: string) {
    if (val === 'left' || val === 'right' || val === 'center' || val === 'justify') {
      this.textAlign = val
    }
  }

  public GetTextAlign (): string {
    return this.textAlign
  }

  public GetCssText (): string {
    let cssText = ''
    if (this.textAlign) {
      cssText += 'text-align:' + this.textAlign + ';'
    }
    if (this.lineHeigth) {
      cssText += 'line-height:' + this.lineHeigth + ';' 
    }
    if (this.borderLeft) {
      cssText += 'border-left:' + this.borderLeft + ';' 
    }
    if (this.color) {
      cssText += 'color:' + this.color + ';' 
    }
    if (this.backgroundColor) {
      cssText += 'background-color:' + this.backgroundColor + ';' 
    }
    if (this.padding) {
      cssText += 'padding:' + this.padding + ';' 
    }
    if (this.fontSize) {
      cssText += 'font-size:' + this.fontSize + ';' 
    }
    if (this.fontWeight) {
      cssText += 'font-weight:' + this.fontWeight + ';' 
    }
    return cssText
  }
}

export class LineFormate implements LineFormateInterface {
  tag: string
  style: LineStyle
  constructor (tag: string, style?: LineStyle) {
    this.tag = tag
    if (style) {
      this.style = style
    }
  }
}
 
export class LineContent implements LineContentInterface {
  public child: TextNode|EmbedNode|ListItemNode|undefined
}

export class LineNode implements LineNodeInterface {
  public tag = 'p'
  public children: LineContent[] = []
  public style: LineStyle

  constructor (tag?: string) {
    if (tag !== undefined) {
      this.tag = tag
    }
    this.style = new LineStyle()
  }

  public PushChild (child: TextNode|ListItemNode): any {
    const content = new LineContent()
    content.child = child
    this.children.push(content)
  }

  public PushChildren (children: TextNode[]|ListItemNode[]): any {
    children.forEach((child: TextNode|ListItemNode) => {
      const content = new LineContent()
      content.child = child
      this.children.push(content)
    })
  }

  public SetChild (vm: any, index: number, child: TextNode): any {
    vm.$set(this.children, index, child)
  }
}
