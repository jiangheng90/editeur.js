// import { TextNodeInterface } from '@/components/editor/types/TextNode'
// import { TextNode } from "@/utils/TextNode";
import { TextNodeInterface } from './TextNode'
import { TextNode } from '../nodes/TextNode'
import { ListItemNodeInterface } from './ListItemNode';

export interface LineNodeInterface {
  tag: string
  children: LineContentInterface[]
  PushChild(child: TextNode): any
  PushChildren(children: TextNode[]): any
  SetChild(vm: any, index: number, child: TextNode): any
}

export interface LineContentInterface {
  child?: TextNodeInterface|ListItemNodeInterface
}
