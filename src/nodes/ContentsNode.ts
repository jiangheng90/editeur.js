// import { LineNode } from '@/utils/LineNode'
// import { ContentsNodeInterface } from '@/components/editor/types/ContentsNode'
import { LineNode } from './LineNode'
import { ContentsNodeInterface } from '../types/ContentsNode'

export class ContentsNode implements ContentsNodeInterface {
  public children: LineNode[] = []

  public PushChild (child: LineNode): any {
    this.children.push(child)
  }

  public PushChildren (children: LineNode[]): any {
    children.map((child) => {
      this.children.push(child)
    })
  }

  public SetChild (vm: any, index: number, child: LineNode): any {
    vm.$set(this.children, index, child)
  }

  public SetContents (vm: any, contents: ContentsNode): any {
    this.children = contents.children
  }

  public IsNodeAtLineEnd (l: number, n: number) {
    const nodeCount = this.children[l].children.length
    return n > nodeCount - 2
  }
}
