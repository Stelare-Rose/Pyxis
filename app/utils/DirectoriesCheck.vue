<script setup lang=ts>
	import { exists, mkdir, BaseDirectory } from '@tauri-apps/plugin-fs';

	const checkDataDir = async (dir: string) => {
		const directoryExists = await exists(dir, { baseDir: BaseDirectory.Data });
		if(!directoryExists){
			await mkdir(dir, { baseDir: BaseDirectory.Data });
		}
	};

	checkDataDir('Pyxis');
	checkDataDir('Pyxis/Tasks');
	checkDataDir('Pyxis/Events');
	checkDataDir('Pyxis/Repeatables');
</script>
