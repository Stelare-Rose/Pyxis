<script setup lang="ts">
	import { useItemStore } from '~/stores/items';

	await useItemStore().reload();
	const allItems = useItemStore().items;
	console.log(allItems);
</script>
<template>
	<div class="container">
		
	</div>
</template>
<style scoped>
	.container {
		flex-direction: row;
		display: flex;
		flex-wrap: wrap;
		max-height: 100%;
	}
</style>
