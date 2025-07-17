<script setup lang=ts>
	import { exists, mkdir, BaseDirectory } from '@tauri-apps/plugin-fs';
	const directoryExists = await exists('Pyxis', { baseDir: BaseDirectory.Data });
	if(!directoryExists){
		await mkdir('Pyxis', { baseDir: BaseDirectory.Data });
	}
</script>
