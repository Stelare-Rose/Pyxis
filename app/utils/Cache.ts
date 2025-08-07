import { BaseDirectory, exists, mkdir, readTextFile } from '@tauri-apps/plugin-fs';
import { info } from '@tauri-apps/plugin-log';

let cachedIndex: IndexItem[] | null = null;

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

export const ReadActiveCacheFile = async (dir: string, output: boolean = true) => {
	if(await isCacheLocked()) return;
	if(cachedIndex) return cachedIndex; //TODO: Hash Check
	const data = await readTextFile(("Pyxis/index-ongoing/" + dir), { baseDir: BaseDirectory.Cache });
	const returnObject: IndexItem[] = JSON.parse(data).items;
	cachedIndex = returnObject;
	if(output) return returnObject;
};

export const SearchCache = async (id: string) => {
	if(cachedIndex == null) ReadActiveCacheFile("items.json", false);
	const data = cachedIndex?.find(x => x.id == id);
	return data;
}
