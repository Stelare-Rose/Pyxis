<script setup lang=ts>
	// UI Bindings
	const hovered = ref();
	const Hovered = ref();
	const selected = ref();
	const color = useColors();
	const backgroundGradient = ref();
	watch(selected, async () => {
		await Reload();
		console.log(selectedItem.value);
	});
	const selectedItem = ref();
	const selectedTasks = ref();
	const tags = ref(await GetAllTags());
	const Reload = async () => {
		selectedItem.value = await GetTagById(selected.value);
		selectedTasks.value = await GetAllByTag(selectedItem.value.id);
		backgroundGradient.value = `linear-gradient(90deg, ${getTagColor(selectedItem.value).map(x => x + '25').join(',')})`;
	}
	onMounted(async () => {
		DatabaseBus.on('reload', () => Reload());
	})
	onUnmounted(() => {
		DatabaseBus.off('reload');
	})

</script>
<template>
	<section class="container-tags">
		<section class="browser">
			<template v-for="tag in tags" :key="tag.id">
				<div class="tag" @mouseenter="hovered=tag.id" @mouseleave="hovered=''" @click="selected = tag.id" :class="{hovered: (hovered == tag.id || selected == tag.id)}">
					<TagsContainer :color="getTagColor(tag)" :textColor="getTagTextColor(tag)" :text="tag.tag" size="small" opaque />
				</div>
			</template>
		</section>
		<section v-if="selectedItem" class="tag-content">
			<section class="data">
				<section class="visual-data">
					<section class="preview">
						<TagsContainer :color="getTagColor(selectedItem)" :textColor="getTagTextColor(selectedItem)" :text="selectedItem.tag" size="large" :key="selectedItem.id"/>
						<div>Preview</div>
					</section>
					<section class="tag-data">
						<div>Name: {{selectedItem.tag}}</div>
						<div>Colors: {{selectedItem.color.map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(", ")}}</div>
					</section>
				</section>
				<section class="visual-data">
					<section class="tag-data">
						<div>Number of Tasks: {{selectedTasks.length}}</div>
					</section>
				</section>
			</section>
			<section class="tags-tasks">
				<section style="width: 320px; height: 100%;">
					<TagsContainer :color="getTagColor(selectedItem)" :textColor="getTagTextColor(selectedItem)" :text="selectedItem.tag" size="medium" :key="selectedItem.id+'med'"/>
					<div :style="{backgroundImage: backgroundGradient, 'width': 'auto', 'padding': '8px 0px', 'border-radius': '12px', 'box-sizing': 'border-box', 'margin': '8px 0px'}">
						<div v-for="item in selectedTasks" :key="item.id">
							<TaskItem :item="item" :isHovered="Hovered == item.id" @mouseenter="Hovered = item.id"  @mouseleave="Hovered = ''"/>
						</div>
					</div>
				</section>
			</section>
		</section>
	</section>
</template>

<style scoped>
	.container-tags {
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
	.data {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		width: 100%;
	}
	.visual-data {
		display: flex;
		flex-direction: row;
		gap: 24px;
		height: 100%;
		height: fit-content;
	}
	.preview {
		align-items: center;
		display: flex;
		flex-direction: column;
		padding: 24px;
		background-color: var(--foam);
		border-radius: 12px;
		gap: 8px;
		min-width: 100px;
	}	
	.tag-data {
		display: flex;
		flex-direction: column;
		padding: 24px;
		background-color: var(--foam);
		border-radius: 12px;
		gap: 4px;
	}
	.tag-content {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-height: 100%;
		padding: 0 12px;
		gap: 8px;
		overflow-y: scroll;
	}
	.tags-tasks {
		width: auto;
		gap: 8px;
	}

</style>
