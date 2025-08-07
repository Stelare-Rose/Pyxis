import { BaseDirectory, exists, mkdir, readTextFile } from '@tauri-apps/plugin-fs';
import { info } from '@tauri-apps/plugin-log';

export const CheckCacheDirectory = async (dir: string, create?: boolean) => {
	const directoryExists = await exists(dir, { baseDir: BaseDirectory.Cache });
	if(!directoryExists && create){
		await mkdir(dir, { baseDir: BaseDirectory.Cache });
	}
	info(`${dir} ${directoryExists ? "Exists!" : "Does Not Exist"}`);
	return directoryExists;
};

export const isCacheLocked = async () => {
	return await exists("Pyxis/index.lock", { baseDir: BaseDirectory.Cache });
};

export const ReadCacheFile = async (dir: string) => {
	if(await isCacheLocked()) return;
	const data = await readTextFile(("Pyxis/index-ongoing/" + dir), { baseDir: BaseDirectory.Cache });
	const returnObject: IndexItem = JSON.parse(data);
	return returnObject;
};
