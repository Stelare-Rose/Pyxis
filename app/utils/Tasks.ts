import moment from 'moment'

// TODO: Add Comments you fool
export const isOverdue = (startDate: Date, endDate: Date) => {
  const start = moment(startDate).unix()
  const end = moment(endDate).unix()
  const now = moment().unix()
  if (now > (isNaN(end) ? now : end)) {
    return 'Overdue'
  }
  if (moment(startDate).startOf('day').unix() == moment().startOf('day').unix() || moment(endDate).startOf('day').unix() == moment().startOf('day').unix()) {
    return 'Today'
  }
  if (start < now && now < end && !isNaN(start) && !isNaN(end)) {
    return 'In Progress'
  }
  if (now < (isNaN(start) ? end : start)) {
    return 'Not Started'
  }
  if (now > (isNaN(start) ? now : start)) {
    return 'In Progress'
  }
  return 'none'
}
