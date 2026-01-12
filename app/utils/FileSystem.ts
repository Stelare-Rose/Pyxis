import { BaseDirectory, exists, mkdir, writeTextFile, remove, readTextFile } from '@tauri-apps/plugin-fs'
import toml from '@iarna/toml'
import { cloneDeep } from 'lodash'
import { environment } from '~/stores/environment'

const base = environment.env == 'dev' ? 'Pyxis-dev' : 'Pyxis'

function isTags(obj: any): obj is WriteTags {
  return obj && typeof obj === 'object' && 'tags' in obj
}

export const CheckDataDirectory = async (dir: string, create?: boolean) => {
  const directoryExists = await exists(dir, { baseDir: BaseDirectory.Data })
  if (!directoryExists && create) {
    await mkdir(dir, { baseDir: BaseDirectory.Data })
  }
  return directoryExists
}

export const CheckCacheDirectory = async (dir: string, create?: boolean) => {
  const directoryExists = await exists(dir, { baseDir: BaseDirectory.AppConfig })
  if (!directoryExists && create) {
    await mkdir(dir, { baseDir: BaseDirectory.AppConfig })
  }
  return directoryExists
}

export const readTags = async () => {
  const processedDir = base + '/tags.toml'
  const fileExists = await exists(processedDir, { baseDir: BaseDirectory.Data })
  if (!fileExists) return null
  const tags = await readTextFile(processedDir, { baseDir: BaseDirectory.Data })
  const raw = toml.parse(tags)
  let returnObject: WriteTags
  if (isTags(raw)) {
    returnObject = raw
  }
  else {
    returnObject = { tags: {} }
  }
  console.log(returnObject)
  return returnObject
}

export const updateTags = async (tag: Tag) => {
  let found = false

  const rawTags = cloneDeep(await readTags())
  const tags: WriteTags = cloneDeep(rawTags) ?? { tags: {} }
  Object.entries(tags.tags).forEach(([key, value]) => {
    if (key == tag.id) {
      found = true
      value.tag = tag.tag
      value.color = tag.color
    }
  })

  if (!found) {
    tags.tags[tag.id] = { tag: tag.tag, color: tag.color }
  }
  if (JSON.stringify(tags) == JSON.stringify(rawTags)) return
  await writeTextFile(base + '/tags.toml', toml.stringify(tags as unknown as Record<string, string | string[]>), { baseDir: BaseDirectory.Data })
}

export const updateItem = async (item: Item) => {
  console.log('Saving!')
  const processedDir = base + '/Items/' + item.path
  console.log(processedDir)

  let contents = ''
  contents += ItemToPlainTextRow('ID', item.id)
  contents += ItemToPlainTextRow('Type', item.type)
  contents += ItemToPlainTextRow('Name', item.name)
  contents += ItemToPlainTextRow('Status', item.status)
  contents += ItemToPlainTextRow('End-Date', item.endDate)
  contents += ItemToPlainTextRow('Start-Date', item.startDate)
  contents += ItemToPlainTextRow('Priority-Date', item.priorityDate)
  contents += ItemToPlainTextRow('Completed-Date', item.completedDate)
  if (item.tags) {
    const tagNames = item.tags.map(x => x.tag + '::' + x.id)
    contents += ItemToPlainTextRow('Tags', tagNames.join(','))
  }
  item.description = await getItemDescription(item)
  if (item.description) {
    contents += '-----\n'
    contents += item.description
  }

  await writeTextFile(processedDir, contents, { baseDir: BaseDirectory.Data })
}

export const writeFile = async (item: Item, newPath: string) => {
  console.log('Saving!')
  const processedDir = base + '/Items/' + item.path
  console.log(processedDir)
  const newDir = base + '/Items/' + newPath + ' id-' + item.id + '.task'
  console.log(newDir)
  console.log(item)

  let contents = ''
  contents += ItemToPlainTextRow('ID', item.id)
  contents += ItemToPlainTextRow('Type', item.type)
  contents += ItemToPlainTextRow('Name', item.name)
  contents += ItemToPlainTextRow('Status', item.status)
  contents += ItemToPlainTextRow('End-Date', item.endDate)
  contents += ItemToPlainTextRow('Start-Date', item.startDate)
  contents += ItemToPlainTextRow('Priority-Date', item.priorityDate)
  contents += ItemToPlainTextRow('Completed-Date', item.completedDate)
  if (item.tags) {
    const tagNames = item.tags.map(x => x.tag + '::' + x.id)
    contents += ItemToPlainTextRow('Tags', tagNames.join(','))
  }
  if (item.description) {
    contents += '-----\n'
    contents += item.description
  }

  if (newDir == processedDir) await writeTextFile(processedDir, contents, { baseDir: BaseDirectory.Data })
  else {
    item.path = newPath + ' id-' + item.id + '.task'
    await writeTextFile(newDir, contents, { baseDir: BaseDirectory.Data })
    if (await (exists(processedDir, { baseDir: BaseDirectory.Data }))) await remove(processedDir, { baseDir: BaseDirectory.Data })
  }
}

export const deleteFile = async (item: Item) => {
  const processedDir = base + '/Items/' + item.path
  if (await exists(processedDir, { baseDir: BaseDirectory.Data })) {
    await remove(processedDir, { baseDir: BaseDirectory.Data })
  }
  else return
}

export const getItemDescription = async (item: Item) => {
  const processedDir = base + '/Items/' + item.path
  if (!item.path) return
  if (!(await exists(processedDir, { baseDir: BaseDirectory.Data }))) return
  const content = await readTextFile(processedDir, { baseDir: BaseDirectory.Data })
  const processed = content.split('-----\n')
  if (processed.length > 1) {
    console.log(content)
    return processed[1]
  }
  console.log('returning whatever')
  return ''
}
