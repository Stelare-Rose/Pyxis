<script setup lang=ts>
	const hovered = ref();
	const selected = ref();
	const tags = ref(await GetAllTags());
</script>
<template>
	<section class="container">
		<section class="browser">
			<template v-for="tag in tags" :key="tag.tag">
				<div class="tag" @mouseenter="hovered=tag.tag" @mouseleave="hovered=''" @click="selected = tag.tag" :class="{hovered: (hovered == tag.tag || selected == tag.tag)}">
					<TagsContainer :color="getTagColor(tag)" :textColor="getTagTextColor(tag)" :text="tag.tag" size="medium" />
				</div>
			</template>
		</section>
		<div> item 2 </div>
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
		padding: 24px 0px;
	}
	.tag {
		border-radius: 8px;
		padding: 8px;
		align-items: center;
		display: flex;
		transition: 0.2s all ease;
	}
	.hovered {
		box-shadow: 4px 4px 4px #61616140, -4px -4px 4px #FFFFFFA0;
	}
</style>
