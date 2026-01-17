import mitt from 'mitt'

const DatabaseBus = mitt<{ reload: boolean }>()
const TaskModalBus = mitt<{ active: boolean, item: Item }>()
const IdeaModalBus = mitt<{ active: boolean, item: Idea }>()

export const SendDatabaseBus = DatabaseBus.emit
export const useDatabaseBus = DatabaseBus.on
export const RemoveDatabaseBus = DatabaseBus.off

export const SendTaskModalBus = TaskModalBus.emit
export const useTaskModalBus = TaskModalBus.on
export const RemoveTaskModalBus = TaskModalBus.off

export const SendIdeaModalBus = IdeaModalBus.emit
export const useIdeaModalBus = IdeaModalBus.on
export const RemoveIdeaModalBus = IdeaModalBus.off
