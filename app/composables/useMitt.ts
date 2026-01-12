import mitt from 'mitt'

const DatabaseBus = mitt<{ reload: void }>()
const TaskModalBus = mitt<{ active: boolean, item: Item }>()

export const SendDatabaseBus = DatabaseBus.emit
export const useDatabaseBus = DatabaseBus.on
export const RemoveDatabaseBus = DatabaseBus.off

export const SendTaskModalBus = TaskModalBus.emit
export const useTaskModalBus = TaskModalBus.on
export const RemoveTaskModalBus = TaskModalBus.off
