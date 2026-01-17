export {}
declare global {
  // Item Types
  interface Item {
    type: ItemType
    id: string
    name: string
    path?: string
    status: ItemStatus
    endDate?: DateTime
    startDate?: DateTime
    priorityDate?: DateTime
    completedDate?: DateTime
    afterTask?: string[]
    tags?: Tag[]
    fingerprint: string
    description?: string
  }
  interface ItemRow {
    type: ItemType
    id: string
    name: string
    path: string
    status?: ItemStatus
    endDate?: DateTime
    startDate?: DateTime
    priorityDate?: DateTime
    completedDate?: DateTime
    afterTask?: string[]
    // Tags is a string here because we parse it later.
    tags?: string
    fingerprint: string
  }
  interface Idea {
    id: string
    name: string
    status: IdeaStatus
    createdDate?: DateTime
    priorityDate?: DateTime
    completedDate?: DateTime
    path?: string
    tags?: Tag[]
    fingerprint: string
    description?: string
  }
  interface IdeaRow {
    id: string
    name: string
    status?: IdeaStatus
    createdDate?: DateTime
    priorityDate?: DateTime
    completedDate?: DateTime
    path: string
    // Tags is a string here because we parse it later.
    tags?: string
    fingerprint: string
  }
  interface WriteTags {
    tags: Record<string, writeTag>
  }
  interface WriteTag {
    tag: string
    color: string[]
  }
  interface Tag {
    id: string
    tag: string
    color: string[]
  }
  interface TagRow {
    id: string
    tag: string
    color: string
  }

  // Pinia
  type Query = { type: 'all' } | { type: 'tags', value: string }
  type ItemStatus = 'Todo' | 'Doing' | 'Scheduled' | 'Done'
  type IdeaStatus = 'Pending' | 'Done'
  type ItemType = 'Task' | 'Event'

  // Input
  interface MultiselectTags {
    value: string
    label: string
    color: string[]
  }

}
