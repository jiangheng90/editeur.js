// import { TextNodeInterface, TextNodeStyleInterface } from '@/components/editor/types/TextNode'
import { TextNodeInterface, TextNodeStyleInterface, HyperLinkPropInterface } from '../types/TextNode'

export class TextNodeStyle implements TextNodeStyleInterface {
  public fontSize?: string
  public fontWeight?: number
  public color?: string
  public fontFamily?: string
  public backgroundColor?: string
  constructor (fontSize?: string, color?: string, fontWeight?: number, fontFamily?: string, backgroundColor?: string) {
    if (fontSize) {
      this.fontSize = fontSize
    }
    if (fontWeight) {
      this.fontWeight = fontWeight
    }
    if (color) {
      this.color = color
    }
    if (fontFamily) {
      this.fontFamily = fontFamily
    }
    if (backgroundColor) {
      this.backgroundColor = backgroundColor
    }
  }

  public GetCssText () {
    let style = ''
    if (this.fontSize) {
      style += 'font-size:' + this.fontSize + ';'
    }
    if (this.fontWeight) {
      style += 'font-weight:' + this.fontWeight + ';'
    }
    if (this.color) {
      style += 'color:' + this.color + ';'
    }
    if (this.fontFamily) {
      style += 'font-family:' + this.fontFamily + ';'
    }
    if (this.backgroundColor) {
      style += 'background-color:' + this.backgroundColor + ';'
    }
    if (style !== '') {
      return style
    } else {
      return ''
    }
  }
}

export const GetFontSize = (val: number, type: number | undefined): string => {
  if (type === 0) {
    return val + 'px'
  } else if (type === 1) {
    return val + 'pt'
  } else {
    return val + 'px'
  }
}

export class TextNode implements TextNodeInterface {
  public tag = 'span'
  public value?: string
  public bold: boolean
  public italic: boolean
  public delete: boolean
  public underScore: boolean
  public style?: TextNodeStyle
  public href?: string
  constructor (tag: string, value?: string, style?: TextNodeStyle) {
    this.tag = tag
    this.value = value
    this.style = style
    this.bold = false
    this.italic = false
    this.delete = false
    this.underScore = false
  }
}

export class HyperLinkProp implements HyperLinkPropInterface {
  label: string
  href: string

  constructor (href: string, label?: string) {
    this.href = href
    if (label !== undefined) {
      this.label = label
    } else {
      this.label = href
    }
  }
}
