<script setup lang=ts>
	// UI Bindings
	const hovered = ref();
	const selected = ref();
	
	watch(selected, async () => {
		console.log(selected.value);
		selectedItem.value = await GetTagById(selected.value);
	});
	const selectedItem = ref();
	const tags = ref(await GetAllTags());
</script>
<template>
	<section class="container">
		<section class="browser">
			<template v-for="tag in tags" :key="tag.id">
				<div class="tag" @mouseenter="hovered=tag.id" @mouseleave="hovered=''" @click="selected = tag.id" :class="{hovered: (hovered == tag.id || selected == tag.id)}">
					<TagsContainer :color="getTagColor(tag)" :textColor="getTagTextColor(tag)" :text="tag.tag" size="small" opaque />
				</div>
			</template>
		</section>
		<section class="data">
			<div>{{selectedItem}}</div>
		</section>
	</section>
</template>

<style scoped>
	.container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		flex: 1;
	}
	.browser {
		width: 20%;
		height: 100%;
		box-sizing: border-box;
		background-color: var(--foam);
		border-radius: 24px;
		gap: 4px;
		display: flex;
		flex-direction: column;
		padding: 24px 4px;
	}
	.tag {
		border-radius: 8px;
		padding: 4px;
		align-items: center;
		display: flex;
		transition: 0.2s all ease;
	}
	.hovered {
		background-color: var(--cream);
		box-shadow: 4px 4px 4px #61616120;
	}
</style>
