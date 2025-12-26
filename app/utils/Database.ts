import Database from '@tauri-apps/plugin-sql';
import { watch, BaseDirectory, readTextFile } from '@tauri-apps/plugin-fs';
import { environment } from '~/stores/environment';

var db: Database;
var fingerprint: string;
const fileName = environment.env == 'dev' ? 'fingerprint-dev' : 'fingerprint';
let init = false;

async function ReadDatabase() {
	const f = await readTextFile(fileName, {baseDir: BaseDirectory.AppConfig});
	if(f == fingerprint) return;
	db = await Database.load(environment.env == 'dev' ? 'sqlite:dev.db' : 'sqlite:main.db');
	fingerprint = f;
}

export async function DatabaseInit(){
	if(init) return;
	init = true;
	await watch(fileName, async (e) => {
		console.log("Detected Reload!");
		if(e.type['access']) return;
		await ReadDatabase();
		ReloadDatabase();
	},{ baseDir: BaseDirectory.AppConfig, delayMs: 20 });
	await ReadDatabase();
}


const parseItemRow: (x: ItemRow) => Item = (x: ItemRow) => {
	let res: Item = {
		id: x.id ?? 0,
		type: isType(x.type) ? x.type : null,
		name: x.name,
		path: x.path,
		status: isStatus(x.status) ? x.status : 'Todo',
		endDate: x.endDate,
		startDate: x.startDate,
		priorityDate: x.priorityDate,
		completedDate: x.completedDate,
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
const parseItemRows: (row: ItemRow[]) => Item[] = (row: ItemRow[]) => {
	let res: Item[] = row.map(x => parseItemRow(x))	
	return res;
}

const parseIdeaRow: (x: IdeaRow) => Idea = (x: IdeaRow) => {
let res: Idea = {
	id: x.id ?? 0,
	name: x.name,
	status: x.status ?? 'Pending',
	path: x.path,
	createdDate: x.createdDate,
	priorityDate: x.priorityDate,
	completedDate: x.completedDate,
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

const parseIdeaRows: (row: IdeaRow[]) => Idea[] = (row: IdeaRow[]) => {
	let res: Idea[] = row.map(x => parseIdeaRow(x))	
	return res;
}

export const GetAllItems: () => Promise<Item[]> = async () => {
	if(!db) await ReadDatabase();
	console.time("query");
	const result: ItemRow[] = await db.select(`SELECT * FROM ActiveItems`);
	
	console.timeEnd("query");
	console.log(result);
	return parseItemRows(result);
}

export const GetAllIdeas: () => Promise<Idea[]> = async () => {
	if(!db) await ReadDatabase();
	console.time("idea query");
	const result: IdeaRow[] = await db.select(`SELECT * FROM ActiveIdeas`);

	console.timeEnd("idea query");
	console.log(result);
	return parseIdeaRows(result);
}

export const GetAllByStatus: (filter: string) => Promise<Item[]> = async (filter: string) => {
	if(!db) await ReadDatabase();
	console.time("query" + filter);
	const result: ItemRow[] = await db.select(`
											  SELECT * FROM ActiveItems i
											  WHERE i.status = $1
											  AND (substr(i.priorityDate, 1, 10) != DATE('now', 'localtime') OR i.priorityDate = '')
											  `, [filter]);

	return parseItemRows(result);
}

export const GetLimitedByStatus: (filter: string, limit: number) => Promise<Item[]> = async (filter: string, limit: number) => {
	if(!db) await ReadDatabase();
	const result: ItemRow[] = await db.select(`
											  SELECT * FROM ActiveItems i
											  WHERE i.status = $1
											  AND (substr(i.priorityDate, 1, 10) != DATE('now', 'localtime') OR i.priorityDate = '')
											  LIMIT $2
											  `, [filter, limit]);
	return parseItemRows(result);
}
export const GetPriority: (offset?: number) => Promise<Item[]> = async (offset: number = 0) => {
	if(!db) await ReadDatabase();
	const result: ItemRow[] = await db.select(`
											  SELECT * FROM ActiveItems i
											  WHERE substr(i.priorityDate, 1, 10) == DATE('now', 'localtime', printf('+%d day', $1))
											  ORDER BY i.name ASC
											  `,
											  [offset]
											 );


	let res: Item[] = parseItemRows(result);
	res = res.sort(Sort());
	return res;
}



export const GetAllByTag = async (filter: string) => {
	if(!db) await ReadDatabase();
	const result: ItemRow[] = await db.select(`
											  SELECT * FROM ActiveItems i
											  WHERE i.id IN (
												  SELECT item_id
												  FROM items_tags
												  WHERE tag_id = $1
											  )
											  ORDER BY i.name ASC
											  `,
											  [filter]
											 );
	let res: Item[] = parseItemRows(result);
	res = res.sort(Sort('doneLast'));
	return res;
}

export const GetById = async (id: string) => {
	if(!db) await ReadDatabase();
	const result: ItemRow[] = await db.select(`
											  SELECT * FROM ActiveItems i
											  WHERE i.id = $1
											  `,
											  [id]
											 );
	const res: Item = parseItemRow(result[0]);
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
