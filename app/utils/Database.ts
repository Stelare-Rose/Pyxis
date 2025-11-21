import Database from '@tauri-apps/plugin-sql';
import { watch, BaseDirectory, readTextFile } from '@tauri-apps/plugin-fs';
import { info } from '@tauri-apps/plugin-log';

var db: Database;
var fingerprint: string;

// Awaits can't exist on their own
init();

const isType = (t: any): t is "Task" | "Event" => t === "Task" || t === "Event";
const isStatus = (s: any): s is "Todo" | "Doing" | "Done" | "Scheduled" => s === "Todo" || s === "Doing" || s === "Done" || s === "Scheduled";

async function ReadDatabase() {
	const f = await readTextFile('fingerprint', {baseDir: BaseDirectory.AppConfig});
	if(f == fingerprint) return;
	db = await Database.load('sqlite:main.db');
	fingerprint = f;
}

async function init(){
	await watch('fingerprint', async (e) => {
		if(e.type['access']) return;
		await ReadDatabase();
		ReloadDatabase();
	},{ baseDir: BaseDirectory.AppConfig, delayMs: 20 });
	await ReadDatabase();
}

/*
export const GetDebug = async () => {
	const result: ItemRow[] = await db.select(`
												SELECT i.id, i.name, i.type, i.path, i.status, i.endDate, i.startDate, GROUP_CONCAT(t.id || ':' || t.tag || ':' || t.color, ';') AS tags,
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

const parseRow: (x: ItemRow) => Item = (x: ItemRow) => {
	let res: Item = {
		id: x.id ?? 0,
		type: isType(x.type) ? x.type : null,
		name: x.name,
		path: x.path,
		status: isStatus(x.status) ? x.status : undefined,
		endDate: x.endDate,
		startDate: x.startDate,
		priorityDate: x.priorityDate,
		tags: x.tags ? 
			x.tags.split(';')
		.map(
			t => {let [id, tag, rawColor] = t.split(':'); 
				const color = rawColor.split(','); 
				return {id, tag, color} as Tag}
		) : undefined,
		fingerprint: x.fingerprint,
	}
	return res;
}
const parseRows: (row: ItemRow[]) => Item[] = (row: ItemRow[]) => {
	let res: Item[] = row.map(x => parseRow(x))	
	return res;
}

export const GetAllItems: () => Promise<Item[]> = async () => {
	if(!db) await ReadDatabase();
	const result: ItemRow[] = await db.select(`
											  SELECT 
											  i.id, 
											  i.name, 
											  i.type, 
											  i.path, 
											  i.status, 
											  i.endDate, 
											  i.startDate, 
											  i.priorityDate, 
											  i.fingerprint,
											  GROUP_CONCAT(t.id || ':' || t.tag || ':' || t.color, ';') AS tags
											  FROM items i
											  LEFT JOIN items_tags it ON i.id = it.item_id
											  LEFT JOIN tags t ON it.tag_id = t.id
											  WHERE i.isArchived = 0 
											  AND (substr(i.priorityDate, 1, 10) != DATE('now', 'localtime') OR i.priorityDate = '')
											  GROUP BY i.id
											  ORDER BY sortDate IS NULL, sortDate ASC, i.name
											  `);
	return parseRows(result);
}

export const GetAllByStatus: (filter: string) => Promise<Item[]> = async (filter: string) => {
	if(!db) await ReadDatabase();
	console.time("query" + filter);
	const result: ItemRow[] = await db.select(`
											  SELECT 
											  i.id, 
											  i.name, 
											  i.type, 
											  i.path, 
											  i.status, 
											  i.endDate, 
											  i.startDate, 
											  i.priorityDate, 
											  i.fingerprint,
											  GROUP_CONCAT(t.id || ':' || t.tag || ':' || t.color, ';') AS tags
											  FROM items i
											  LEFT JOIN items_tags it ON i.id = it.item_id
											  LEFT JOIN tags t ON it.tag_id = t.id
											  WHERE i.isArchived = 0 
											  AND i.status = $1
											  AND (substr(i.priorityDate, 1, 10) != DATE('now', 'localtime') OR i.priorityDate = '')
											  GROUP BY i.id
											  ORDER BY sortDate IS NULL, sortDate ASC, i.name
											  `, [filter]);

	return parseRows(result);
}

export const GetLimitedByStatus: (filter: string, limit: number) => Promise<Item[]> = async (filter: string, limit: number) => {
	if(!db) await ReadDatabase();
	const result: ItemRow[] = await db.select(`
											  SELECT 
											  i.id, 
											  i.name, 
											  i.type, 
											  i.path, 
											  i.status, 
											  i.endDate, 
											  i.startDate, 
											  i.priorityDate, 
											  i.fingerprint,
											  GROUP_CONCAT(t.id || ':' || t.tag || ':' || t.color, ';') AS tags
											  FROM items i
											  LEFT JOIN items_tags it ON i.id = it.item_id
											  LEFT JOIN tags t ON it.tag_id = t.id
											  WHERE i.isArchived = 0 
											  AND i.status = $1
											  AND (substr(i.priorityDate, 1, 10) != DATE('now', 'localtime') OR i.priorityDate = '')
											  GROUP BY i.id
											  ORDER BY sortDate IS NULL, sortDate ASC, i.name
											  LIMIT $2
											  `, [filter, limit]);
	return parseRows(result);
}
export const GetPriority: (offset?: number) => Promise<Item[]> = async (offset: number = 0) => {
	if(!db) await ReadDatabase();
	const result: ItemRow[] = await db.select(`
											  SELECT 
											  i.id, 
											  i.name, 
											  i.type, 
											  i.path, 
											  i.status, 
											  i.endDate, 
											  i.startDate, 
											  i.priorityDate, 
											  i.fingerprint,
											  GROUP_CONCAT(t.id || ':' || t.tag || ':' || t.color, ';') AS tags
											  FROM items i
											  LEFT JOIN items_tags it ON i.id = it.item_id
											  LEFT JOIN tags t ON it.tag_id = t.id
											  WHERE 
											  i.isArchived = 0 
											  AND substr(i.priorityDate, 1, 10) == DATE('now', 'localtime', printf('+%d day', $1))
											  GROUP BY i.id
											  ORDER BY i.name ASC
											  `,
											  [offset]
											 );


	let res: Item[] = parseRows(result);
	res = res.sort(Sort());
	return res;
}



export const GetAllByTag = async (filter: string) => {
	if(!db) await ReadDatabase();
	const result: ItemRow[] = await db.select(`
											  SELECT 
											  i.id, 
											  i.name, 
											  i.type, 
											  i.path, 
											  i.status, 
											  i.endDate, 
											  i.startDate, 
											  i.priorityDate, 
											  i.fingerprint,
											  GROUP_CONCAT(t.id || ':' || t.tag || ':' || t.color, ';') AS tags
											  FROM items i
											  LEFT JOIN items_tags it ON i.id = it.item_id
											  LEFT JOIN tags t ON it.tag_id = t.id
											  WHERE 
											  i.isArchived = 0 
											  AND i.id IN (
												  SELECT item_id
												  FROM items_tags
												  WHERE tag_id = $1
											  )
											  GROUP BY i.id
											  ORDER BY i.name ASC
											  `,
											  [filter]
											 );
	let res: Item[] = parseRows(result);
	res = res.sort(Sort('doneLast'));
	return res;
}

export const GetById = async (id: string) => {
	if(!db) await ReadDatabase();
	const result: ItemRow = await db.select(`
											  SELECT 
											  i.id, 
											  i.name, 
											  i.type, 
											  i.path, 
											  i.status, 
											  i.endDate, 
											  i.startDate, 
											  i.priorityDate, 
											  i.fingerprint,
											  GROUP_CONCAT(t.id || ':' || t.tag || ':' || t.color, ';') AS tags
											  FROM items i
											  LEFT JOIN items_tags it ON i.id = it.item_id
											  LEFT JOIN tags t ON it.tag_id = t.id
											  WHERE i.id = $1
											  GROUP BY i.id
											  `,
											  [id]
											 );
	const res: Item = parseRow(result);
	return res;
}


export const GetAllTags = async () => {
	if(!db) await ReadDatabase();
	const resultRaw: TagRow[] = await db.select(`
										  SELECT * FROM tags
										  WHERE verified = 1
									      ORDER BY tag ASC
										  `);
	let result: Tag[] = resultRaw.map(x => ({id: x.id, tag: x.tag, color: x.color.split(',')}));

	return result;
}

export const GetTagById = async (id: string) => {
	if(!db) await ReadDatabase();
	const rows: TagRow[] = await db.select(`
												SELECT * FROM tags
												WHERE verified = 1 AND id = $1
									            ORDER BY tag ASC
												LIMIT 1
												`, [id])
	const resultRaw: TagRow | undefined = rows.at(0);
	if(resultRaw == undefined) return;
	const result: Tag = {id: resultRaw.id, tag: resultRaw.tag, color: resultRaw.color.split(',')};
	return result;
}
