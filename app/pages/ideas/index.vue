<script setup lang="ts">
	const { ideas } = storeToRefs(useIdeaStore());
	const Hovered = ref();
</script>
<template>
	<div class="container">
		<template v-for="idea in ideas" :key="idea.id + idea.fingerprint">
			<div><IdeaItem :item="idea" :isHovered="Hovered == idea.id" @mouseenter="Hovered = idea.id"  @mouseleave="Hovered = ''"/></div>
		</template>
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
