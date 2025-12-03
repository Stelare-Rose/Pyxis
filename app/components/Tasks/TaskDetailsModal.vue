<script setup lang=ts>
	// Imports
	import Multiselect from '@vueform/multiselect';
	import VueDatePicker from '@vuepic/vue-datepicker';
	import moment from 'moment';
	import { v4 as uuidv4 } from 'uuid'
	import { uiStore } from '~/stores/ui';
	import hotkeys from 'hotkeys-js';

	//Style Imports
	import '@vuepic/vue-datepicker/dist/main.css'
	import '@vueform/multiselect/themes/default.css'

	//Shortcuts
	hotkeys.filter = () => true
	hotkeys('esc', (e) => {
		console.log(e.key);
		disable();
	});
	//Styling
	const trashColor = ref('#000');
	const colors = useColors();

	//Input Bindings
	const item = ref<Item>({id: '0', name:'', type:'Task', status:'Todo', fingerprint: '0'});
	const titleInput = ref();
	const type = ref<{value: string[], label:string, color: string}>({value: ['Task', 'orange,lemon'], label: 'Task', color: 'orange,lemon'});
	const status = ref<{value: string[], label: string, color: string}>({value: ['Todo', 'strawberry'], label: 'Todo', color: 'strawberry'});
	const startDate = ref();
	const endDate = ref();
	const priorityDate = ref();
	const tagList = ref<({value: string, label: string, color: string[]} | undefined)[]>();
	const description = ref<string>();

	//Default Values
	const tags = ref((await GetAllTags()));
	const tagsOptions = ref(tags.value.map(x => ({label: x.tag, value: x.id, color: x.color})));
	const startTime = ref({ hours: 23, minutes: 59 });
	const types = ref([
		{value: ['Task', 'orange, lemon'], label: 'Task', color: 'orange,lemon'},
		{value: ['Event', 'blueberry, grape'], label: 'Event', color: 'blueberry,grape'}
	])
	const statuses = ref([
		{value: ['Todo', 'strawberry'], label: 'Todo', color: 'strawberry', disabled: type.value.label == 'Event'},
		{value: ['Doing', 'orange'], label: 'Doing', color: 'orange', disabled: type.value.label == 'Event'},
		{value: ['Scheduled', 'blueberry'], label: 'Scheduled', color: 'blueberry'},
		{value: ['Done', 'mint'], label: 'Done', color: 'mint'}
	])

	// Data Bindings
	const UpdateType = (option: any) => {
		statuses.value = statuses.value.map(x => { x.disabled = (x.label == 'Todo' || x.label == 'Doing') && option.label == 'Event'; return x});
		if(option.label == 'Event' && status.value.label == 'Todo'){
			status.value = {value: ['Scheduled', 'blueberry'], label: 'Scheduled', color: 'blueberry'}
			item.value.status = isStatus(status.value.label) ? status.value.label : undefined;
		}
		item.value.type = option.label;
	}
	const UpdateStatus = (option: any) => {
		item.value.status = option.label;
	}
	const UpdateTags = (option: any) => {
		item.value.tags = option.map((x: any) => {
			return tags.value.find(t => t.id == x.value);
		});
		if(option.length == 0){
			delete item.value.tags;
		}
	}
	const UpdateStartDate = (modelData: any) => {
		item.value.startDate = moment(modelData).toISOString(true);
	}
	const UpdateEndDate = (modelData: any) => {
		item.value.endDate = moment(modelData).toISOString(true);
	}
	const UpdatePriorityDate = (modelData: any) => {
		item.value.priorityDate = moment(modelData).toISOString(true);
	}
	
	// Event Handlers
	const enabled = ref(false);
	const event = async (e:boolean) => {
		console.log("Loading Modal!");
		console.log(item);
		enabled.value = e;
		if(e) uiStore.canscroll = false;
		else {
			uiStore.canscroll = true;
			item.value = {id: '0', name:'', type:'Task', status: 'Todo', fingerprint: '0'};
			console.log(item);
			return;
		}
		tags.value = await GetAllTags();
		tagsOptions.value = tags.value.map(x => ({label: x.tag, value: x.id, color: x.color, trackBy: x.tag}));
		if(item.value.id == '0'){
			description.value = '';
			item.value.id = uuidv4();
			nextTick(() => {
			    titleInput.value.focus()
			})
			await loadItem(item.value);
		}

	}
	const disable = () => {
		if(item.value.name && item.value.type && item.value.status) SaveData();
		HideTaskModal();
	}
	const loadItem = async (i: Item) => {
		description.value = await getItemDescription(i);
		item.value = i;
		type.value = types.value.find(x => x.label == item.value.type) ?? {value: ['Task', 'orange,lemon'], label: 'Task', color: 'orange,lemon'};
		status.value = statuses.value.find(x => x.label == item.value.status) ?? {value: ['Todo', 'strawberry'], label: 'Todo', color: 'strawberry'};
		startDate.value = item.value.startDate;
		endDate.value = item.value.endDate;
		priorityDate.value = item.value.priorityDate;
		tagList.value = item.value.tags?.flatMap(x => (tagsOptions.value.find(t => t.label == x.tag))) ?? [];
		console.log("Loading Item!");
		console.log(item.value);
	}

	// Event Listeners
	onMounted(async () => {
		useTaskModalBus('item', i => loadItem(i));
		useTaskModalBus('active', e => event(e));
		useDatabaseBus('reload', async () => tags.value = await GetAllTags());
	})
	onBeforeUnmount(() => {
		RemoveTaskModalBus('item');
		RemoveTaskModalBus('active');
		RemoveDatabaseBus('reload');
	})

	//Filesystem Bindings
	const SaveData = () => {
		const path = "Active/" + item.value.name;
		item.value.description = description.value;
		writeFile(item.value, path);
	}
	const Delete =() => {
		deleteFile(item.value);
		HideTaskModal();
	}
	
</script>
<template>
	<transition name="modal">
	<section class="modal-background" v-if="enabled" @click.self="disable">
		<transition name="modal-content" appear>
		<section class="modal" v-if="enabled">
			<section class="modal-data">
				<section class="modal-metadata">
					<input class="large-text-input" ref="titleInput" v-model="item.name" placeholder="Title" />
					<div class="properties">
						<div class="property">
							<div class="row">
								<Icon :height='24' :width='24' style="margin-right: 8px"><FileInfo /></Icon>
								<div class="medium-text">Type</div>
							</div>
							<div class="row-property">
								<Multiselect :options="types" mode="single" v-model="type" :can-deselect="false" :can-clear="false" :object="true" @change="UpdateType" class="hovered" :caret="false">
								<template #singlelabel="{value}">
									<TagsContainer style="margin-right: auto; margin-left: 8px" :color="getRawColor(value.color)" :textColor="getRawTextColor(value.color)" :text="value.label" :key="value.value"/>
								</template>
								<template #option="{option}">
									<TagsContainer :color="getRawColor(option.color)" :textColor="getRawTextColor(option.color)" :text="option.label" :key="option.value"/>
								</template>
								</Multiselect>
							</div>
						</div>
						<div class="property">
							<div class="row">
								<Icon :height='24' :width='24' style="margin-right: 8px"><Question /></Icon>
								<div class="medium-text">Status</div>
							</div>
							<div class="row-property">
								<Multiselect :options="statuses" mode="single" v-model="status" :can-deselect="false" :can-clear="false" :object="true" @change="UpdateStatus" :caret="false">
								<template #singlelabel="{value}">
									<TagsContainer style="margin-right: auto; margin-left: 8px" :color="getStatusColor(value.label)" :textColor="getStatusTextColor(value.label)" :text="value.label" :key="value.value"/>
								</template>
								<template #option="{option}">
									<TagsContainer :color="getStatusColor(option.label)" :textColor="getStatusTextColor(option.label)" :text="option.label" :key="option.value"/>
								</template>
								</Multiselect>
							</div>
						</div>
						<div class="property">
							<div class="row">
								<Icon :height='24' :width='24' style="margin-right: 8px"><CalendarCheck :strokeColor="colors.text.leaf" /></Icon>
								<div class="medium-text">Start Date</div>
							</div>
							<div class="row-property">
								<vue-date-picker :text-input="{ format: 'dd/MM/yyyy HH:mm' }" v-model="startDate" :start-time="startTime" @update:model-value="UpdateStartDate"></vue-date-picker>
							</div>
						</div>
						<div class="property">
							<div class="row">
								<Icon :height='24' :width='24' style="margin-right: 8px"><CalendarExclamation :strokeColor="colors.text.strawberry" /></Icon>
								<div class="medium-text">End Date</div>
							</div>
							<div class="row-property">
								<vue-date-picker :text-input="{ format: 'dd/MM/yyyy HH:mm' }" v-model="endDate" :start-time="startTime" @update:model-value="UpdateEndDate"></vue-date-picker>
							</div>
						</div>
						<div class="property">
							<div class="row">
								<Icon :height='24' :width='24' style="margin-right: 8px"><Star :strokeColor="colors.text.lilac"/></Icon>
								<div class="medium-text">Priority Date</div>
							</div>
							<div class="row-property">
								<vue-date-picker v-model="priorityDate" :start-time="startTime" @update:model-value="UpdatePriorityDate" :enable-time-picker="false"></vue-date-picker>
							</div>
						</div>
						<div class="property">
							<div class="row">
								<Icon :height='24' :width='24' style="margin-right: 8px"><Tags /></Icon>
								<div class="medium-text">Tags</div>
							</div>
							<div class="row-property">
								<Multiselect :placeholder="'Click to select tags..'" :options="tagsOptions" mode="tags" v-model="tagList" :object="true" :close-on-select="false" @change="UpdateTags" :caret="false" :searchable="true">
								<template #tag="{option, handleTagRemove}">
									<TagsContainer style="margin-right: 8px" :color="getTagColor(option)" :textColor="getTagTextColor(option)" :text="option.label ?? option.tag" @click="handleTagRemove(option, $event)" :key="Math.random()"/>
								</template>
								<template #option="{option}">
									<TagsContainer :color="getTagColor(option)" :textColor="getTagTextColor(option)" :text="option.label" :key="Math.random()"/>
								</template>
								</Multiselect>
							</div>
						</div>
					</div>
				</section>
				<section class="modal-description">
					<MilkdownEditorWrapper v-model='description' :key='item.id' :id='item.id'/>
				</section>
			</section>
			<section class="modal-bottom">
				<Icon :height='20' :width='20' @mouseenter="trashColor = '#CF8282'" @mouseleave="trashColor ='#000'" @click="Delete"><Trash :stroke-color="trashColor" /></Icon>
			</section>
		</section>
	</transition>
		</section>
	</transition>
</template>

<style>
	.multiselect-tags-search {
		background-color: var(--foam);
	}
</style>
<style scoped>
	.dp__theme_light {
		--dp-background-color: var(--foam);
		--dp-text-color: #212121;
		--dp-hover-color: #CF8282;
		--dp-hover-text-color: #212121;
		--dp-hover-icon-color: #959595;
		--dp-primary-color: #CF8282;
		--dp-primary-disabled-color: #6bacea;
		--dp-primary-text-color: #f8f5f5;
		--dp-secondary-color: #c0c4cc;
		--dp-border-color: var(--foam);
		--dp-menu-border-color: #EDB7CA;
		--dp-border-color-hover: #EDB7CA;
		--dp-border-color-focus: #EDB7CA;
		--dp-disabled-color: #f6f6f6;
		--dp-scroll-bar-background: #f3f3f3;
		--dp-scroll-bar-color: #959595;
		--dp-success-color: #76d275;
		--dp-success-color-disabled: #a3d9b1;
		--dp-icon-color: #959595;
		--dp-danger-color: #ff6f60;
		--dp-marker-color: #ff6f60;
		--dp-tooltip-color: #fafafa;
		--dp-disabled-color-text: #8e8e8e;
		--dp-highlight-color: rgb(25 118 210 / 10%);
		--dp-range-between-dates-background-color: var(--dp-hover-color, #f3f3f3);
		--dp-range-between-dates-text-color: var(--dp-hover-text-color, #212121);
		--dp-range-between-border-color: var(--dp-hover-color, #f3f3f3);
	}

	.multiselect {
		background-color: var(--foam);
		border: 1px #EDB7CA;
		width: 100%;
	}

	.properties {
		display: grid;
		grid-template-columns: auto 1fr;		
		gap: 0.5rem 1rem;	
		align-items: center;
		margin-top: 8px;
	}
	.property {
		display: contents;
	}
	.row {
		display:flex;
		width: 100%;
		align-items: center;
		flex-direction: row;
		grid-column: 1;	
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
		border-right: 2px solid var(--base);
		padding: 12px;
	}
	.modal-description{
		flex: 1;
		box-sizing: border-box;
		height: 100%;
		overflow-y: scroll;
		overflow-x: hidden;
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
		padding: 32px 16px;
	}
	.modal-data {
		display: flex;
		flex-direction: row;
		height: 100%;
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
		transition: all 0.2s ease;
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
		transition: all 0.2s ease;
	}
	.fade-enter-from, .fade-leave-to {
		background: rgba(0,0,0,0);
		opacity: 0;
	}
	.fade-enter-to, .fade-leave-from {
		background: rgba(0,0,0,0.3);
		opacity: 1;
	}
	.fade-enter-active, .fade-leave-active {
		transition: all 0.2s ease;
	}
</style>
