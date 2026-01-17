export const ReloadDatabase = () => {
  SendDatabaseBus('reload', true)
}

export const ShowTaskModal = (item?: Item) => {
  SendTaskModalBus('active', true)
  if (item) {
    SendTaskModalBus('item', item)
  }
}

export const HideTaskModal = () => {
  SendTaskModalBus('active', false)
}

export const ShowIdeaModal = (item?: Idea) => {
  SendIdeaModalBus('active', true)
  if (item) {
    SendIdeaModalBus('item', item)
  }
}

export const HideIdeaModal = () => {
  SendIdeaModalBus('active', false)
}
