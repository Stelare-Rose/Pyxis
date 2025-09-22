import { BaseDirectory, exists, mkdir, readTextFileLines, writeTextFile, remove, readTextFile } from '@tauri-apps/plugin-fs';
import { info } from '@tauri-apps/plugin-log';
import toml from '@iarna/toml'
import { cloneDeep } from 'lodash';

export const CheckDataDirectory = async (dir: string, create?: boolean) => {
	const directoryExists = await exists(dir, { baseDir: BaseDirectory.Data });
	if(!directoryExists && create){
		await mkdir(dir, { baseDir: BaseDirectory.Data });
	}
	return directoryExists;
};

export const CheckCacheDirectory = async (dir: string, create?: boolean) => {
	const directoryExists = await exists(dir, { baseDir: BaseDirectory.AppConfig });
	if(!directoryExists && create){
		await mkdir(dir, { baseDir: BaseDirectory.AppConfig });
	}
	return directoryExists;
};

export const ReadFile = async (dir?: string) => {
	let processedDir = "Pyxis/" + dir;
	const fileExists = await exists(processedDir, {baseDir: BaseDirectory.Data});
	let returnObject: Item = {type: null};
	if(!fileExists) return returnObject;
	
	const lines = await readTextFileLines(processedDir, {baseDir: BaseDirectory.Data});
	for await (const line of lines){
		let index = line.indexOf(":");
		let [type, value] = [line.slice(0, index), line.slice(index + 1)];
		value = value.replace("\u0000", "");
		switch(type){
			case "[Type]":
				switch(value){
					case "Task":
						returnObject.type = "Task"
						break;
					case "Event":
						returnObject.type = "Event"
						break;
					default:
						break;
				}
				break;
			case "[ID]":
				returnObject.id = value;
				break;
			case "[Name]":
				returnObject.name = value;
				break;
			case "[Status]":
				switch(value){
					case "Todo":
						returnObject.status = "Todo";
						break;
					case "Doing":
						returnObject.status = "Doing";
						break;
					case "Done":
						returnObject.status = "Done";
						break;
					case "Scheduled":
						returnObject.status = "Scheduled";
						break;
					default:
						break;
				}
			case "[Hard-Deadline]":
				returnObject.endDate = Date.parse(value);
				break;
			case "[Soft-Deadline]":
				returnObject.startDate = Date.parse(value);
				break;
			case "[After-Task]":
				returnObject.afterTask = value.split(',').map(s => s.trim());
				break;
			case "[Tags]":
				returnObject.tags = value.split(',').map(s => s.trim());
				break;
			default:
				break;
		}
	}
	return returnObject;
}

export const readTags = async () => {
	let processedDir = "Pyxis/tags.toml";
	const fileExists = await exists(processedDir, {baseDir: BaseDirectory.Data});
	if(!fileExists) return null;
	const tags = await readTextFile(processedDir, {baseDir: BaseDirectory.Data});
	const returnObject = toml.parse(tags);
	return returnObject;
}

export const updateTags = async (tag: Tag) => {	
	let found = false;

	let rawTags = cloneDeep(await readTags());
	let tags = cloneDeep(rawTags) ?? {tags: {}};
	Object.entries(tags.tags).forEach(([key, value]) => {
		if(key == tag.id){
			found = true;
			value.name = tag.tag;
			value.colors = tag.color;
		}
	})
	
	if(!found) {
		tags.tags[tag.id] = {name: tag.tag, colors: tag.color}
	}
	if(JSON.stringify(tags) == JSON.stringify(rawTags)) return;
	await writeTextFile("Pyxis/tags.toml", toml.stringify(tags), {baseDir: BaseDirectory.Data});

}

export const updateItem = async (item: IndexItem) => {
	console.log("Saving!");
	let processedDir = "Pyxis/Items/" + item.path;
	console.log(processedDir);
	
	let contents = "";
	contents += ItemToPlainTextRow("ID", item.id);
	contents += ItemToPlainTextRow("Type", item.type);
	contents += ItemToPlainTextRow("Name", item.name);
	contents += ItemToPlainTextRow("Status", item.status);
	contents += ItemToPlainTextRow("Hard-Deadline", item.endDate);
	contents += ItemToPlainTextRow("Soft-Deadline", item.startDate);
	if(item.tags){
		const tagNames = item.tags.map(x => x.tag + '::' + x.id);
		contents += ItemToPlainTextRow("Tags", tagNames.join(','));
	}

	await writeTextFile(processedDir, contents, {baseDir: BaseDirectory.Data});
}

export const writeFile = async (item: IndexItem, newPath: string) => {
	console.log("Saving!");
	let processedDir = "Pyxis/Items/" + item.path;
	console.log(processedDir);
	let newDir = "Pyxis/Items/" + newPath;
	console.log(newDir);
	console.log(item);
	
	let contents = "";
	contents += ItemToPlainTextRow("ID", item.id);
	contents += ItemToPlainTextRow("Type", item.type);
	contents += ItemToPlainTextRow("Name", item.name);
	contents += ItemToPlainTextRow("Status", item.status);
	contents += ItemToPlainTextRow("Hard-Deadline", item.endDate);
	contents += ItemToPlainTextRow("Soft-Deadline", item.startDate);
	if(item.tags){
		const tagNames = item.tags.map(x => x.tag + '::' + x.id);
		contents += ItemToPlainTextRow("Tags", tagNames.join(','));
	}

	if(newDir == processedDir) await writeTextFile(processedDir, contents, {baseDir: BaseDirectory.Data});
	else {
		item.path = newPath;
		await writeTextFile(newDir, contents, {baseDir: BaseDirectory.Data});
		await remove(processedDir, {baseDir: BaseDirectory.Data});
	}
}

export const deleteFile = async (item: IndexItem) => {
	let processedDir = "Pyxis/Items/" + item.path;
	if(await exists(processedDir, {baseDir: BaseDirectory.Data})){
		await remove(processedDir, {baseDir: BaseDirectory.Data});
	} else return;
}
