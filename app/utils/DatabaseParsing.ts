export const parseItemRow: (x: ItemRow) => Item = (x: ItemRow) => {
  const res: Item = {
    id: x.id ?? 0,
    type: isType(x.type) ? x.type : null,
    name: x.name,
    path: x.path,
    status: isStatus(x.status) ? x.status : 'Todo',
    endDate: x.endDate,
    startDate: x.startDate,
    priorityDate: x.priorityDate,
    completedDate: x.completedDate,
    tags: x.tags
      ? x.tags.split(';')
        .map(
          (t) => {
            const [id, tag, rawColor] = t.split(':')
            const color = rawColor.split(',')
            return { id, tag, color } as Tag
          },
        )
      : undefined,
    fingerprint: x.fingerprint,
  }
  return res
}

export const parseItemRows: (row: ItemRow[]) => Item[] = (row: ItemRow[]) => {
  const res: Item[] = row.map(x => parseItemRow(x))
  return res
}

export const parseIdeaRow: (x: IdeaRow) => Idea = (x: IdeaRow) => {
  const res: Idea = {
    id: x.id ?? 0,
    name: x.name,
    status: x.status ?? 'Pending',
    path: x.path,
    createdDate: x.createdDate,
    priorityDate: x.priorityDate,
    completedDate: x.completedDate,
    tags: x.tags
      ? x.tags.split(';')
        .map(
          (t) => {
            const [id, tag, rawColor] = t.split(':')
            const color = rawColor.split(',')
            return { id, tag, color } as Tag
          },
        )
      : undefined,
    fingerprint: x.fingerprint,
  }
  return res
}

export const parseIdeaRows: (row: IdeaRow[]) => Idea[] = (row: IdeaRow[]) => {
  const res: Idea[] = row.map(x => parseIdeaRow(x))
  return res
}
