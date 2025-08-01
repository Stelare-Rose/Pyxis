import { BaseDirectory, exists, mkdir, readTextFileLines } from '@tauri-apps/plugin-fs';
import { info } from '@tauri-apps/plugin-log';

export const CheckCacheDirectory = async (dir: string, create?: boolean) => {
	const directoryExists = await exists(dir, { baseDir: BaseDirectory.Cache });
	if(!directoryExists && create){
		await mkdir(dir, { baseDir: BaseDirectory.Cache });
	}
	info(`${dir} ${directoryExists ? "Exists!" : "Does Not Exist"}`);
	return directoryExists;
};
