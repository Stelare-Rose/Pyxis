import { exists, mkdir, BaseDirectory } from '@tauri-apps/plugin-fs';
import { info } from '@tauri-apps/plugin-log';

export const CheckDirectory = async (dir: string, create?: boolean) => {
	const directoryExists = await exists(dir, { baseDir: BaseDirectory.Data });
	if(!directoryExists && create){
		await mkdir(dir, { baseDir: BaseDirectory.Data });
	}
	info(`${dir} ${directoryExists ? "Exists!" : "Does Not Exist"}`);
	return directoryExists;
};

