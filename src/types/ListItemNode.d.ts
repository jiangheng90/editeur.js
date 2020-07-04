import { LineNodeInterface } from './LineNode'

export interface ListItemNodeInterface {
    tag: string
    child: LineNodeInterface
}

export interface ListStateInterface {
    type?: number,
    symbol?: string,
    list: boolean
}