// import { TextNodeInterface } from '@/components/editor/types/TextNode'
// import { TextNode } from "@/utils/TextNode";
import { TextNodeInterface } from './TextNode'
import { TextNode } from '../nodes/TextNode'
import { ListItemNodeInterface } from './ListItemNode';
import { EmbedNodeInterface } from './EmbedNode';

export interface LineStyleInterface {
}

export interface LineFormateInterface {
  tag: string
  style: LineStyleInterface
}

export interface LineNodeInterface {
  tag: string
  children: LineContentInterface[]
  style: LineStyleInterface
  PushChild(child: TextNode): any
  PushChildren(children: TextNode[]): any
  SetChild(vm: any, index: number, child: TextNode): any
}

export interface LineContentInterface {
  child?: TextNodeInterface|ListItemNodeInterface|EmbedNodeInterface
}
