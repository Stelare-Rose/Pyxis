<script setup lang=ts>
	import moment from 'moment';
	const props = defineProps<{
		item: IndexItem,
		remove?: string[];
		isHovered?: boolean;
	}>()
	const item = props.item
	let afterTasks: (undefined | IndexItem)[];
	if(item.afterTask){
		afterTasks = await Promise.all(item.afterTask.map(x => SearchCache(x)));
	}
	const colors = useColors();
	let statusColor: string[];

	if(item.status){
		switch(item.status){
			case 'Todo':
				statusColor = [colors.text.strawberry, colors.pastel.strawberry];
				break;
			case 'Doing':
				statusColor = [colors.text.orange, colors.pastel.orange];
				break;
			case 'Scheduled':
				statusColor = [colors.text.blueberry, colors.pastel.blueberry];
				break;
			case 'Done':
				statusColor = [colors.text.leaf, colors.pastel.leaf];
		}
	}
	const getTagColor: string[] = (t: Tag) => {
		return t.color.map(x => colors.pastel[x as string] as string);
	}
	const getTagTextColor: string[] = (t: Tag) => {
		return t.color.map(x => colors.text[x as string] as string);
	}
	const OpenItem = () => {
		TaskModalBus.emit('item', item);
		TaskModalBus.emit('active', true);
	}
</script>

<template>
	<div v-if="item.type != null" class="container" :class="{'hovered-animation': props.isHovered}" @click="OpenItem">
		<div class="content">
			<div class="row">
				<Icon :height='18' :width='18' style="margin: 0 4px 0 0" >
				<template v-if="item.type == 'Task'"><Clipboard /></template>
				<template v-if="item.type == 'Event'"><Calendar /></template>
				</Icon>
				<span class="small-text">{{item.type}}</span>
			</div>
			<div class="large-text">
				{{item.name}}
			</div>
			<div v-if="(item.status && !(remove?.includes('status'))) || item.hardDeadline || item.tags" class="divider" />
			<div v-if="item.status && !(remove?.includes('status'))" class="row">
				<Icon :height='18' :width='18' style="margin: 0 4px 0 0" ><Question /></Icon>
				<TagsContainer :textColor='[statusColor[0]]' :color='[statusColor[1]]' :text='item.status'/>
			</div>
			<div v-if="item.softDeadline" class="row">
				<Icon :height='18' :width='18' style="margin: 0 4px 0 0" ><CalendarCheck /></Icon>
				<span v-if="!item.softDeadline.includes('T') || (moment(item.softDeadline).isSame(moment(item.softDeadline).startOf('day')))" class="medium-text" >{{moment(item.softDeadline).format("LL")}}</span>
				<span v-else class="medium-text">{{moment(item.softDeadline).format("LLL")}}</span>
			</div>
			<div v-if="item.hardDeadline" class="row">
				<Icon :height='18' :width='18' style="margin: 0 4px 0 0" ><CalendarExclamation /></Icon>
				<span v-if="!item.hardDeadline.includes('T') || (moment(item.hardDeadline).isSame(moment(item.hardDeadline).startOf('day')))" class="medium-text" >{{moment(item.hardDeadline).format("LL")}}</span>
				<span v-else class="medium-text">{{moment(item.hardDeadline).format("LLL")}}</span>
			</div>
			<div v-if="item.tags" class="row">
				<Icon :height='18' :width='18' style="margin: 0 4px 0 0" ><Tags /></Icon>
				<div class="tags">
					<template v-for="tag in item.tags">
						<TagsContainer :textColor='getTagTextColor(tag)' :color='getTagColor(tag)' :text='tag.tag' />
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.top-right {
		position: absolute;
		top: 0;
		right: 0;
		margin: 8px;
	}
	.row {
		align-items: center;
		display: flex;
		flex-direction: row;
		margin-top: 4px;
	}
	.tags {
		display: flex;
		flex-direction: row;
		width: 100%;
		flex-wrap: wrap;
		gap: 4px;
	}
	.small-text {
		font-size: 11pt;
		vertical-align: baseline;
	}
	.medium-text {
		font-size: 12pt;
		vertical-align: baseline;
	}
	.large-text {
		font-size: 13pt;
	}
	.divider {
		border-bottom: solid 1px #EDE7D3;
		width: 80%;
		margin-left: 8px;
		margin: 4px 0 0 0;
		height: 0;
	}
	.content {
		width: 100%;
		padding: 8px;
		position: relative;
	}
	.container {
		border-radius: 12px;
		width: 280px;
		background-color: var(--foam);
		margin: 20px;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.container::before {
		content: '';
		height: 100%;
		width: 100%;
		position: absolute;
		box-shadow: 0 4px 5px #00000040;
		border-radius: 12px;
		z-index: -2;
	}

	.container::after {
		--angle: 0deg;
		height: 100%;
		width: 100%;
		background-image: conic-gradient(from var(--angle), var(--strawberry), var(--lemon), var(--leaf), var(--mint), var(--sky), var(--grape), var(--lavender), var(--pink), var(--strawberry));
		opacity: 0;
		padding: 2px;
		content: '';
		position: absolute;
		z-index: -1;
		border-radius: 14px;
	}

	.hovered-animation::after {
		opacity: 1;
		animation: 1s spin linear 1;
	}

	@keyframes spin {
		from {
			--angle: 0deg;
		} to {
			--angle: 360deg;
		}
	}

	@property --angle {
		syntax: "<angle>";
		initial-value: 0deg;
		inherits: false;
	}
	
</style>
