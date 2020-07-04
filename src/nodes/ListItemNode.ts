// import { ListItemNodeInterface } from '@/components/editor/types/ListItemNode'
import { ListItemNodeInterface } from '../types/ListItemNode'
import { LineNode } from './LineNode'

export const ListType = {
  NoSort: 0,
  Sort: 1,
  Multi: 2
}

export class ListItemNode implements ListItemNodeInterface {
    public tag = 'li'
    public child: LineNode

    constructor (child?: LineNode) {
      if (child) {
        this.child = child
      } else {
        this.child = new LineNode()
      }
    }
}
