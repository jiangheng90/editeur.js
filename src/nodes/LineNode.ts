// import { LineContentInterface, LineNodeInterface } from '@/components/editor/types/LineNode'
// import { TextNode } from '@/utils/TextNode'
import { LineContentInterface, LineNodeInterface } from '../types/LineNode'
import { TextNode } from './TextNode'
import { ListItemNode } from './ListItemNode'

export class LineContent implements LineContentInterface {
  public child: TextNode|ListItemNode|undefined
}

export class LineNode implements LineNodeInterface {
  public tag = 'p'
  public children: LineContent[] = []

  constructor (tag?: string) {
    if (tag !== undefined) {
      this.tag = tag
    }
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
