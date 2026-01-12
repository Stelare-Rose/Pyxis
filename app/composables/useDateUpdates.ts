import moment from 'moment'

export const useDateUpdate = (item: Ref<Item>) => {
  const updateDate = (
    field: 'startDate' | 'endDate' | 'priorityDate' | 'completedDate',
    value: Date,
  ) => {
    if (!value) {
      item.value[field] = null
      return
    }
    item.value[field] = moment(value).toISOString(true)
  }

  return { updateDate }
}
