<script setup lang=ts>
	CheckDataDirectory("Pyxis", true)
	CheckDataDirectory("Pyxis/Items", true)
	CheckDataDirectory("Pyxis/Repeatables", true)
	CheckCacheDirectory("Pyxis", true)
	CheckCacheDirectory("Pyxis/index-ongoing", true)
	CheckCacheDirectory("Pyxis/index-completed", true)
	const tempItem = await ReadFile("Items/Example2.task");
	console.log(tempItem);
	console.log(await ReadCacheFile("items.json"));

</script>
<template>
  <div> I forgot to tell you this but yes it loaded! </div>
		  <TaskItem task='Items/2025-08/Example2.task' />
</template>
