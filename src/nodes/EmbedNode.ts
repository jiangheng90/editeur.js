import { EmbedNodeStyleInterface, EmbedNodeInterface } from "../types/EmbedNode";

export class EmbedNodeStyle implements EmbedNodeStyleInterface {
  width: string
  height: string
  constructor () {
    this.width = 'auto'
    this.height = 'auto'
  }

  public GetCssText () {
    let cssText = ''
    if (this.width) {
      cssText += 'width:' + this.width + ';'
    }
    if (this.height) {
      cssText += 'height:' + this.height + ';'
    }
    return cssText
  }
}

export class EmbedNode implements EmbedNodeInterface {
  public tag: string = 'embed'
  src: string
  type: string
  style: EmbedNodeStyle
  constructor () {
    this.style = new EmbedNodeStyle()
  }
}