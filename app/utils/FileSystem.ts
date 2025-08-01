import { BaseDirectory, exists, mkdir, readTextFileLines } from '@tauri-apps/plugin-fs';
import { info } from '@tauri-apps/plugin-log';

export const CheckDataDirectory = async (dir: string, create?: boolean) => {
	const directoryExists = await exists(dir, { baseDir: BaseDirectory.Data });
	if(!directoryExists && create){
		await mkdir(dir, { baseDir: BaseDirectory.Data });
	}
	info(`${dir} ${directoryExists ? "Exists!" : "Does Not Exist"}`);
	return directoryExists;
};

export const ReadFile = async (dir?: string) => {
	let processedDir = "Pyxis/" + dir;
	const fileExists = await exists(processedDir, {baseDir: BaseDirectory.Data});
	let returnObject: Item = {type: null, id: "0", name: "0", status: null};
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
				returnObject.hardDeadline = Date.parse(value);
				break;
			case "[Soft-Deadline]":
				returnObject.softDeadline = Date.parse(value);
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
