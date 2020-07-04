// import { TextNodeInterface, TextNodeStyleInterface } from '@/components/editor/types/TextNode'
import { TextNodeInterface, TextNodeStyleInterface } from '../types/TextNode'

export class TextNodeStyle implements TextNodeStyleInterface {
  public fontSize?: string
  public fontWeight?: number
  public color?: string
  public font?: string
  public backgroundColor?: string
  constructor (fontSize?: string, color?: string, fontWeight?: number, font?: string, backgroundColor?: string) {
    if (fontSize) {
      this.fontSize = fontSize
    }
    if (fontWeight) {
      this.fontWeight = fontWeight
    }
    if (color) {
      this.color = color
    }
    if (font) {
      this.font = font
    }
    if (backgroundColor) {
      this.backgroundColor = backgroundColor
    }
  }

  public GetStyle () {
    let style = ''
    if (this.fontSize) {
      style += 'font-size:' + this.fontSize
    }
    if (this.fontWeight) {
      style += ';font-weight:' + this.fontWeight
    }
    if (this.color) {
      style += ';color:' + this.color
    }
    if (this.font) {
      style += ';font:' + this.font
    }
    if (this.backgroundColor) {
      style += ';background-color:' + this.backgroundColor
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
