// import { LineNodeInterface } from '@/components/editor/types/LineNode'
// import { LineNode } from '@/utils/LineNode'
// import { ContentsNode } from '@/utils/ContentsNode'
import { LineNodeInterface } from './LineNode'
import { LineNode } from '../nodes/LineNode'
import { ContentsNode } from '../nodes/ContentsNode'

export interface ContentsNodeInterface {
  children : LineNodeInterface[]
  PushChild (child: LineNode): any
  PushChildren (children: LineNode[]): any
  SetChild (vm: any, index: number, child: LineNode): any
  SetContents (vm: any, contents: ContentsNode): any
}
