export interface SelectionInterface {
  anchor: SelectionNodeInterface | undefined
  focus: SelectionNodeInterface | undefined
  isSelection (
    select: any
  ) :boolean
}

export interface SelectionNodeInterface {
  lineIndex: number | undefined
  nodeIndex: number | undefined
  offset: number
}

export interface MouseSelectionInterface {
  start?: SelectionNodeInterface
  end?: SelectionNodeInterface
}
