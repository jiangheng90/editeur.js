export interface TextNodeInterface {
  tag: string
  value?: string
  bold: boolean
  italic: boolean
  delete: boolean
  underScore: boolean
  style?: TextNodeStyleInterface
}

export interface TextNodeStyleInterface {
  color?: string
  font?: string
  fontSize?: string
  fontWeight?: number
  backgroundColor?: string
}

export interface TextNodeStateInterface {
  strong: boolean
  em: boolean
  s: boolean
  u: boolean
}

export interface HyperLinkPropInterface {
  label: string,
  href: string
}
