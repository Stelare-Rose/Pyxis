<script setup lang=ts>
import { debounce } from 'lodash';
import { nanoid } from 'nanoid'

	// UI Bindings
	const hovered = ref();
	const Hovered = ref();
	const selected = ref();
	const color = useColors();
	const backgroundGradient = ref();
	const titleInput = ref();
	watch(selected, async () => {
		console.log(selected.value);
		if(selected.value == 'new'){
			selectedItem.value = {id: nanoid(8), tag: 'New Tag', color: ['strawberry']}; 
			//TODO: Random Color Generator for Fun !!
			selectedTasks.value = null;
			selected.value = selectedItem.value.id;
			return;
		}
		await Reload();
	});
	const selectedItem = ref();
	const selectedTasks = ref();
	const tags = ref(await GetAllTags());
	const Reload = async (partial?: boolean) => {
		tags.value = await GetAllTags();
		if(!partial) selectedItem.value = await GetTagById(selected.value) ?? null;
		selectedTasks.value = await GetAllByTag(selectedItem.value.id);
		selected.value = selectedItem.value.id;
		backgroundGradient.value = `linear-gradient(90deg, ${getTagColor(selectedItem.value).map(x => x + '25').join(',')})`;
		nextTick(() => {
			titleInput.value.focus()
		})
	}
	const removeItem = (index: number) => {
		if(selectedItem.value.color.length > 1)
		selectedItem.value.color = selectedItem.value.color.slice(0, index).concat(selectedItem.value.color.slice(index + 1))
	}
	watch(selectedItem, async () => {
		debounceUpdate();
	}, {deep: true});

	const debounceUpdate = debounce(() => {
		if(selectedItem.value.tag == 'New Tag' && tags.value.find(x => x.id == selectedItem.value.id) == undefined){
			return;
		}
		updateTags(selectedItem.value);
	}, 500);
	onMounted(async () => {
		DatabaseBus.on('reload', () => Reload(true))
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
					<TagsContainer :color="getTagColor(tag)" :textColor="getTagTextColor(tag)" :text="tag.tag" size="small" opaque :key="Math.random()"/>
				</div>
			</template>
			<div class="tag" @mouseenter="hovered='new'" @mouseleave="hovered=''" @click="selected = 'new'" :class="{hovered: (hovered == 'new')}" style="justify-content: center; display: flex;"> <Icon :height="18" :width="18"><Plus /></Icon>
			</div>
			{{hovered}}
			{{selectedItem}}
			{{selected}}
		</section>
		<section v-if="selectedItem" class="tag-content">
			<section class="data">
				<section class="preview">
					<TagsContainer :color="getTagColor(selectedItem)" :textColor="getTagTextColor(selectedItem)" :text="selectedItem.tag" size="medium" :key="Math.random()"/>
					<div>Preview</div>
				</section>
				<section class="tag-data">
					<div class="property">
						<div>
							<Icon style="margin-right: 2px" :height='18' :width='18'><Tags /></Icon>Name
						</div>
						<div>
							<input class="text-input" ref="titleInput" v-model="selectedItem.tag" placeholder="Untitled" />
						</div>
					</div>
					<div class="property">
						<div>
							<Icon style="margin-right: 2px" :height='18' :width='18'><Palette /></Icon>Colors 
						</div>
						<div style="flex-wrap: wrap">
							<template v-for="(c, index) in selectedItem.color">
								<span style="transition: 0.2s all ease; padding: 0px 4px; border-radius: 8px; display: inline-block;" @mouseenter="hovered=selectedItem.id + c + index" @mouseleave="hovered=''" :style="{backgroundColor: (color.pastel[c] + ((hovered == selectedItem.id + c + index) ? '60' : '00'))}" @click="removeItem(index)">
									<Icon style="margin-right: 2px":height='12' :width='12'><Circle :fillColor="color.pastel[c]" :strokeColor="color.pastel[c]"/></Icon>{{c.charAt(0).toUpperCase() + c.substring(1)}} 
								</span>
							</template>
						</div>
					</div>
				</section>
				<section class="color-picker">
					<template v-for="(c, name) in color.pastel">
						<span @click="selectedItem.color.push(name)">
							<Icon style="margin-right: 4px":height='18' :width='18'><Circle :fillColor="c" :strokeColor="c"/></Icon>
						</span>
					</template>
				</section>
			</section>
			<section class="tags-tasks" v-if="selectedTasks && selectedTasks.length > 0">
				<section style="width: 320px; height: 100%;">
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
		min-height: 24px;
	}
	.hovered {
		background-color: var(--cream);
		box-shadow: 4px 4px 4px #61616120;
	}
	.data {
		display: grid;
		width: 100%;
		gap: 12px;
		grid-template-columns: 0.5fr 1fr 1fr 1fr;
	}
	.color-picker {
		padding: 24px;
		background-color: var(--foam);
		border-radius: 12px;
		height: fit-content;
		grid-column: 2;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}
	.visual-data {
		display: flex;
		flex-direction: row;
		gap: 24px;
		height: fit-content;
	}
	.preview {
		align-items: center;
		justify-content: center;
		display: flex;
		flex-direction: column;
		padding: 24px;
		background-color: var(--foam);
		border-radius: 12px;
		gap: 8px;
		grid-column: 1;
		grid-row-start: 1;
		grid-row-end: 3;
	}	
	.tag-data {
		display: grid;
		grid-template-columns: auto 1fr;		
		gap: 0.5rem 1rem;	
		align-items: center;
		padding: 24px;
		background-color: var(--foam);
		border-radius: 12px;
		grid-column: 2;
	}
	.property {
		display: contents;
	}
	.tag-content {
		display: flex;
		flex-direction: column;
		width: 80%;
		max-height: 100%;
		padding: 0 12px;
		gap: 8px;
		overflow-y: scroll;
	}
	.tags-tasks {
		width: auto;
		gap: 8px;
	}
	.text-input {
		font-size: 13pt;
		background: none;
		border: none;
		width: 100%;
		outline: none;
	}

</style>
