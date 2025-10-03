import Database from '@tauri-apps/plugin-sql';
import { watch, BaseDirectory, readTextFile } from '@tauri-apps/plugin-fs';
import { info } from '@tauri-apps/plugin-log';

var db: Database;
var fingerprint: string;

init();

async function ReadDatabase(f: string) {
	db = await Database.load('sqlite:main.db');
	fingerprint = f;
}

async function init(){
	await watch('fingerprint', async (e) => {
		if(e.type['access']) return;
		const f = await readTextFile('fingerprint', {baseDir: BaseDirectory.AppConfig});
		await ReadDatabase(f);
		ReloadDatabase();
	},{ baseDir: BaseDirectory.AppConfig, delayMs: 20 });
	await ReadDatabase("b");
}

/*
export const GetDebug = async () => {
	const result: IndexRow[] = await db.select(`
												SELECT i.id, i.name, i.type, i.path, i.status, i.endDate, i.startDate, GROUP_CONCAT(t.id || ':' || t.name || ':' || t.color, ';') AS tags,
												DATE('now') - DATE(i.endDate)
												FROM items i
												LEFT JOIN items_tags it ON i.id = it.item_id
												LEFT JOIN tags t ON it.tag_id = t.id
												WHERE i.isArchived = 0
												GROUP BY i.id
												ORDER BY i.name ASC
												`);

	return result;
}
*/

export const GetAllItems = async () => {
	const result: IndexRow[] = await db.select(`
												SELECT i.id, i.name, i.type, i.path, i.status, i.endDate, i.startDate, GROUP_CONCAT(t.id || ':' || t.name || ':' || t.color, ';') AS tags FROM items i
												LEFT JOIN items_tags it ON i.id = it.item_id
												LEFT JOIN tags t ON it.tag_id = t.id
												WHERE i.isArchived = 0
												GROUP BY i.id
												ORDER BY i.name ASC
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
	console.time("query" + filter);
	const result: IndexRow[] = await db.select(`
												SELECT i.id, i.name, i.type, i.path, i.status, i.endDate, i.startDate, i.priorityDate, GROUP_CONCAT(t.id || ':' || t.name || ':' || t.color, ';') AS tags FROM items i
												LEFT JOIN items_tags it ON i.id = it.item_id
												LEFT JOIN tags t ON it.tag_id = t.id
												WHERE i.isArchived = 0 AND i.status = $1 AND (substr(i.priorityDate, 1, 10) != DATE('now') or i.priorityDate == '')
												GROUP BY i.id
												ORDER BY i.name ASC
												`, [filter]);
	
	let res: IndexItem[] = result.map(x => ({
										id: x.id,
										type: x.type,
										name: x.name,
										path: x.path,
										status: x.status,
										endDate: x.endDate,
										startDate: x.startDate,
										priorityDate: x.priorityDate,
										tags: x.tags ? x.tags.split(';').map(t => {let [id, tag, rawColor] = t.split(':'); const color = rawColor.split(','); return {id, tag, color} as Tag}) : undefined})
									   );

	console.timeEnd("query" + filter);
	res = res.sort(Sort());
	return res;
}

export const GetLimitedByStatus = async (filter: string, limit: number) => {
	const result: IndexRow[] = await db.select(`
												SELECT i.id, i.name, i.type, i.path, i.status, i.endDate, i.startDate, i.priorityDate, GROUP_CONCAT(t.id || ':' || t.name || ':' || t.color, ';') AS tags FROM items i
												LEFT JOIN items_tags it ON i.id = it.item_id
												LEFT JOIN tags t ON it.tag_id = t.id
												WHERE i.isArchived = 0 AND i.status = $1 AND (substr(i.priorityDate, 1, 10) != DATE('now') or i.priorityDate == '')
												GROUP BY i.id
												ORDER BY i.name ASC
												LIMIT $2
												`, [filter, limit]);

	let res: IndexItem[] = result.map(x => ({
										id: x.id,
										type: x.type,
										name: x.name,
										path: x.path,
										status: x.status,
										endDate: x.endDate,
										startDate: x.startDate,
										priorityDate: x.priorityDate,
										tags: x.tags ? x.tags.split(';').map(t => {let [id, tag, rawColor] = t.split(':'); const color = rawColor.split(','); return {id, tag, color} as Tag}) : undefined})
									   );

	res = res.sort(Sort());
	return res;
}
export const GetPriority = async () => {
	const result: IndexRow[] = await db.select(`
												SELECT i.id, i.name, i.type, i.path, i.status, i.endDate, i.startDate, i.priorityDate, GROUP_CONCAT(t.id || ':' || t.name || ':' || t.color, ';') AS tags FROM items i
												LEFT JOIN items_tags it ON i.id = it.item_id
												LEFT JOIN tags t ON it.tag_id = t.id
												WHERE i.isArchived = 0 AND substr(i.priorityDate, 1, 10) == DATE('now')
												GROUP BY i.id
												ORDER BY i.name ASC
												`);

	let res: IndexItem[] = result.map(x => ({
										id: x.id,
										type: x.type,
										name: x.name,
										path: x.path,
										status: x.status,
										endDate: x.endDate,
										startDate: x.startDate,
										priorityDate: x.priorityDate,
										tags: x.tags ? x.tags.split(';').map(t => {let [id, tag, rawColor] = t.split(':'); const color = rawColor.split(','); return {id, tag, color} as Tag}) : undefined})
									   );

	res = res.sort(Sort());
	return res;
}



export const GetAllByTag = async (filter: string) => {
	const result: IndexRow[] = await db.select(`
												SELECT i.id, i.name, i.type, i.path, i.status, i.endDate, i.startDate, GROUP_CONCAT(t.id || ':' || t.name || ':' || t.color, ';') AS tags FROM items i
												LEFT JOIN items_tags it ON i.id = it.item_id
												LEFT JOIN tags t ON it.tag_id = t.id
												WHERE i.isArchived = 0 AND i.id IN (
													SELECT item_id 
													FROM items_tags 
													WHERE tag_id = $1
												)
												GROUP BY i.id
												ORDER BY i.name ASC
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

	res = res.sort(Sort('doneLast'));
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
									      ORDER BY name ASC
										  `);
	let result: Tag[] = resultRaw.map(x => ({id: x.id, tag: x.name, color: x.color.split(',')}));

	return result;
}

export const GetTagById = async (id: string) => {
	const resultRaw: TagRow[] = await db.select(`
												SELECT * FROM tags
												WHERE verified = 1 AND id = $1
									            ORDER BY name ASC
												`, [id])
	const result: Tag = {id: resultRaw[0].id, tag: resultRaw[0].name, color: resultRaw[0].color.split(',')};
	return result;
}
