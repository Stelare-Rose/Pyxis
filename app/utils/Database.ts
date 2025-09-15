import Database from '@tauri-apps/plugin-sql';
import { watch, BaseDirectory, readTextFile } from '@tauri-apps/plugin-fs';

var db = await Database.load('sqlite:main.db');
var fingerprint: string;

async function ReadDatabase(f: string) {
	db = await Database.load('sqlite:main.db');
	fingerprint = f;
}

await watch('fingerprint', async (e) => {
	if(e.type['access']) return;
	const f = await readTextFile('fingerprint', {baseDir: BaseDirectory.AppConfig});
	await ReadDatabase(f);
	ReloadDatabase();
},{ baseDir: BaseDirectory.AppConfig, delayMs: 20 });

export const GetAllItems = async () => {
	const result: IndexRow[] = await db.select(`
												SELECT i.id, i.name, i.type, i.path, i.status, i.endDate, i.startDate, GROUP_CONCAT(t.id || ':' || t.name || ':' || t.color, ';') AS tags FROM items i
												LEFT JOIN items_tags it ON i.id = it.item_id
												LEFT JOIN tags t ON it.tag_id = t.id
												WHERE i.isArchived = 0
												GROUP BY i.id
												`);

	let res: IndexItem[] = result.map(x => ({
										id: x.id ?? 0,
										type: x.type,
										name: x.name,
										path: x.path,
										status: x.status,
										endDate: x.endDate,
										startDate: x.startDate,
										tags: x.tags ? x.tags.split(';').map(t => {let [id, tag, rawColor] = t.split(':'); const color = rawColor.split(','); return {id, tag, color} as Tag}) : undefined})
									   );
	console.log(res)

	return res;
}

export const GetAllByStatus = async (filter: string) => {
	const result: IndexRow[] = await db.select(`
												SELECT i.id, i.name, i.type, i.path, i.status, i.endDate, i.startDate, GROUP_CONCAT(t.id || ':' || t.name || ':' || t.color, ';') AS tags FROM items i
												LEFT JOIN items_tags it ON i.id = it.item_id
												LEFT JOIN tags t ON it.tag_id = t.id
												WHERE i.isArchived = 0 AND i.status = $1
												GROUP BY i.id
												`, [filter]);

	let res: IndexItem[] = result.map(x => ({
										id: x.id,
										type: x.type,
										name: x.name,
										path: x.path,
										status: x.status,
										endDate: x.endDate,
										startDate: x.startDate,
										tags: x.tags ? x.tags.split(';').map(t => {let [id, tag, rawColor] = t.split(':'); const color = rawColor.split(','); return {id, tag, color} as Tag}) : undefined})
									   );

	console.log(res)
	res = res.sort(Sort());
	return res;
}

export const GetById = async (id: string) => {
	const result: IndexRow = await db.select(`
											 SELECT i.id, i.name, i.type, i.path, i.status, i.endDate, i.startDate, GROUP_CONCAT(t.tag || ':' || t.color, ',') AS tags FROM items i
											 LEFT JOIN items_tags it ON i.id = it.item_id
											 LEFT JOIN tags t ON it.tag_name = t.tag
											 WHERE i.id = $1
											 GROUP BY i.id
											 `, [id]);
	const res: IndexItem = ({
												 id: result.id,
												 type: result.type,
												 name: result.name,
												 path: result.path,
												 status: result.status,
												 endDate: result.endDate,
												 startDate: result.startDate,
												 tags: result.tags ? result.tags.split(',').map(t => {let [name, rawColor] = t.split(':'); const color = rawColor.split(','); return {name, color} as Tag}) : undefined})
	return res;
}


export const GetAllTags = async () => {
	const resultRaw: TagRow[] = await db.select(`
										  SELECT * FROM tags
										  WHERE verified = 1
										  `);
	const result: Tag[] = resultRaw.map(x => ({id: x.id, tag: x.name, color: x.color.split(',')}));
	console.log(result);

	return result;
}

export const GetTagById = async (id: string) => {
	const resultRaw: TagRow[] = await db.select(`
												SELECT * FROM tags
												WHERE verified = 1 AND id = $1
												`, [id])

	const result: Tag[] = resultRaw.map(x => ({id: x.id, tag: x.name, color: x.color.split(',')}));
	return result;
}
