import { BaseDirectory, exists, mkdir, readTextFile } from '@tauri-apps/plugin-fs';
import { info } from '@tauri-apps/plugin-log';

let cachedIndex: IndexItem[] | null = null;
let fingerprint: string | null = null;
export const CheckCacheDirectory = async (dir: string, create?: boolean) => {
	const directoryExists = await exists(dir, { baseDir: BaseDirectory.AppConfig });
	if(!directoryExists && create){
		await mkdir(dir, { baseDir: BaseDirectory.AppConfig });
	}
	return directoryExists;
};

export const isCacheLocked = async () => {
	return await exists("Pyxis/index.lock", { baseDir: BaseDirectory.Cache });
};

export const ReadActiveCacheFile = async (dir: string, output: boolean = true) => {
	if(await isCacheLocked()) return;
	if(cachedIndex && await CheckCache()) return cachedIndex;

	const data = await readTextFile(("Pyxis/index-ongoing/" + dir), { baseDir: BaseDirectory.Cache });
	const returnObject: IndexItem[] = JSON.parse(data).items;
	cachedIndex = returnObject;
	fingerprint = await readTextFile("Pyxis/index-ongoing/fingerprint", {baseDir: BaseDirectory.Cache});
	if(output) return returnObject;
};

export const CheckCache = async () => {
	const newFingerprint = await readTextFile("Pyxis/index-ongoing/fingerprint", {baseDir: BaseDirectory.Cache});
	console.log(fingerprint == newFingerprint);
	return fingerprint == newFingerprint;
}
export const SearchCache = async (id: string) => {
	if(cachedIndex == null || await CheckCache() == false) ReadActiveCacheFile("items.json", false);
	const data = cachedIndex?.find(x => x.id == id);
	return data;
}
