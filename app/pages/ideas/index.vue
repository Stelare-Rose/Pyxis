<script setup lang="ts">
	const { ideas } = storeToRefs(useIdeaStore());
</script>
<template>
	<div class="container">
		{{ideas}}
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
