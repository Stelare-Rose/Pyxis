<script setup lang=ts>
	import Multiselect from '@vueform/multiselect';
	const item = ref<Item>({id: '0'});
	const enabled = ref(false);
	const event = (e:boolean) => {
		enabled.value = e;
		if(e) document.body.style.overflow = 'hidden'; else document.body.style.overflow = "scroll";
	}
	const tags = ref((await GetAllTags()).map(x => ({label: x.tag, value: [x.tag, x.color], color: x.color})));
	console.log(tags);
	const disable = () => {
		HideTaskModal();
	}
	onMounted(async () => {
		TaskModalBus.on('active', e => event(e));
		DatabaseBus.on('reload', async () => tags.value = await GetAllTags());
	})
	onUnmounted(() => {
		TaskModalBus.off('active');
		DatabaseBus.off('reload');
	})
	const colors = useColors();
	const tagList = ref<[{value: string[], label: string, color: string}]>();
	const status = ref<{value: string[], label: string, color: string}>({value: ['Todo', 'strawberry'], label: 'Todo', color: 'strawberry'});
	const statuses = ref([
		{value: ['Todo', 'strawberry'], label: 'Todo', color: 'strawberry'},
		{value: ['Doing', 'orange'], label: 'Doing', color: 'orange'},
		{value: ['Scheduled', 'blueberry'], label: 'Scheduled', color: 'blueberry'},
		{value: ['Done', 'mint'], label: 'Done', color: 'mint'}
	])
	const getTagColor: (t: string) => string[] = (t: string) => {
		return t.split(',').map(x => colors.pastel[x as string] as string);
	}
	const getTagTextColor: (t: string) => string[] = (t: string) => {
		return t.split(',').map(x => colors.text[x as string] as string);
	}
</script>
<template>
	<transition name="modal">
		<section class="modal-background" v-if="enabled" @click.self="disable">
	<transition name="modal-content" appear>
		<section class="modal" v-if="enabled">
			<section class="modal-metadata">
				<input class="large-text-input" :value="item.name" placeholder="Title"></input>
				<div class="properties">
					<div class="property">
						<div class="row">
							<Icon :height='24' :width='24' style="margin-right: 8px"><Question /></Icon>
							<div class="medium-text">Status</div>
						</div>
						<div class="row-property">
							<Multiselect :options="statuses" mode="single" v-model="status" :can-deselect="false" :can-clear="false" :object="true" >
								<template #singlelabel="{value}">
									<TagsContainer style="margin-right: auto; margin-left: 8px" :color="getTagColor(value.color)" :textColor="getTagTextColor(value.color)" :text="value.label" :key="value.label"/>
								</template>
								<template #option="{option}">
									<TagsContainer :color="getTagColor(option.color)" :textColor="getTagTextColor(option.color)" :text="option.label" :key="option.label"/>
								</template>
							</Multiselect>
						</div>
					</div>
					<div class="property">
						<div class="row">
							<Icon :height='24' :width='24' style="margin-right: 8px"><Calendar /></Icon>
							<div class="medium-text">Soft Deadline</div>
						</div>
					</div>
					<div class="property">
						<div class="row">
							<Icon :height='24' :width='24' style="margin-right: 8px"><CalendarExclamation /></Icon>
							<div class="medium-text">Hard Deadline</div>
						</div>
					</div>
					<div class="property">
						<div class="row">
							<Icon :height='24' :width='24' style="margin-right: 8px"><Tags /></Icon>
							<div class="medium-text">Tags</div>
						</div>
						<div class="row-property">
							<Multiselect :placeholder="'Click to select tags..'" :options="tags" mode="tags" v-model="tagList" :close-on-select="false">
								<template #tag="{option, handleTagRemove}">
									<TagsContainer style="margin-right: 8px" :color="getTagColor(option.color)" :textColor="getTagTextColor(option.color)" :text="option.label" @click="handleTagRemove(option, $event)"/>
								</template>
								<template #option="{option}">
									<TagsContainer :color="getTagColor(option.color)" :textColor="getTagTextColor(option.color)" :text="option.label" :key="option.label"/>
								</template>
							</Multiselect>
						</div>
					</div>
				</div>
			</section>
			<section class="modal-description">
			</section>
		</section>
	</transition>
		</section>
	</transition>
</template>
<style src="@vueform/multiselect/themes/default.css">
</style>
<style scoped>
	.multiselect {
		background-color: var(--foam);
		border: none;
		margin-right: 24px;
	}
	.properties {
		display: grid;
		grid-template-columns: auto 1fr; /* left = icon+label, right = value */
		gap: 0.5rem 1rem; /* vertical & horizontal spacing */
		align-items: center;
		margin-top: 8px;
		grid-auto-rows: minmax(32px, auto);
	}
	.property {
		display: contents;
	}
	.row {
		display:flex;
		width: 100%;
		align-items: center;
		flex-direction: row;
		grid-column: 1; /* stick together in the left column */
	}
	.row-property {
		grid-column: 2;
		display:flex;
		width: 100%;
		align-items: center;
		flex-direction: row;
	}
	.medium-text{
		font-size: 12pt;
	}
	.modal-metadata {
		width: 40%;
		height: 100%;
		box-sizing: border-box;
		margin: 16px 0px;
		border-right: 2px solid var(--base);
		padding: 8px;
	}
	.large-text-input {
		font-size: 20pt;
		background: none;
		border: none;
		width: 100%;
		outline: none;
	}
	.modal {
		width: 75%;
		height: 80%;
		background-color: var(--foam);
		border-radius: 24px;
		z-index: 10001;
		padding: 16px;
	}
	.modal-background {
		width: 100vw;
		height: 100vh;
		position: fixed;
		background: rgba(0,0,0,0.3);
		top: 0;
		left: 0;
		z-index: 10000;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.modal-content-enter-from, .modal-content-leave-to {
		transform: scale(0.9);
		opacity: 0;
	}
	.modal-content-enter-to, .modal-content-leave-from {
		transform: scale(1);
		opacity: 1;
	}
	.modal-content-enter-active, .modal-content-leave-active {
		transition: all 0.25s ease;
	}
	.modal-enter-from, .modal-leave-to {
		background: rgba(0,0,0,0);
		opacity: 0;
	}
	.modal-enter-to, .modal-leave-from {
		background: rgba(0,0,0,0.3);
		opacity: 1;
	}
	.modal-enter-active, .modal-leave-active {
		transition: all 0.25s ease;
	}
</style>
