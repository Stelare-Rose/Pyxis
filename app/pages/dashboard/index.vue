<script setup lang="ts">
	import { VueDraggable } from 'vue-draggable-plus'
	import moment from 'moment';
	let ItemsTodo = ref<IndexItem[]>([]);
	let ItemsDoing = ref<IndexItem[]>([]);
	let ItemsScheduled = ref<IndexItem[]>([]);
	let ItemsDone = ref<IndexItem[]>([]);
	let ItemsPriority = ref<IndexItem[]>([]);
	let Hovered = ref<string>();
	const Reload = async () => {
		const allItems = await GetAllItems();

		ItemsTodo.value = [];
		ItemsDoing.value = [];
		ItemsScheduled.value = [];
		ItemsDone.value = [];
		const statusMap = {
		  Todo: ItemsTodo.value,
		  Doing: ItemsDoing.value,
		  Scheduled: ItemsScheduled.value,
		  Done: ItemsDone.value,
		};

		allItems.forEach(item => {
		  const list = statusMap[item.status];
		  if (list) list.push(item);
		});
		console.log(allItems);
		ItemsPriority.value = await GetPriority();
	}
	const onListChange = async (event: any) => {
		Hovered.value = '';
		if (event.from.id == event.to.id) return;
		if (event.to.id == 'Priority'){
			event.data.status = event.from.id;
			const todayPriority = moment().endOf('day').seconds(0).milliseconds(0).format("YYYY-MM-DDTHH:mm:ss.SSSZ");

			event.data.priorityDate = todayPriority;
			ItemsPriority.value = ItemsPriority.value.map(i => i.id == event.data.id ? { ...i, priorityDate: todayPriority } : i);
			await updateItem(event.data);
			return;
		}
		if (event.data) {
			event.data.status = event.to.id;
			switch(event.to.id){
				case 'Todo': {
					ItemsTodo.value = ItemsTodo.value.map(i => i.id == event.data.id ? { ...i, status: 'Todo' } : i);
					ItemsTodo.value = ItemsTodo.value.sort(Sort());
					break;
				}
				case 'Doing': {
					ItemsDoing.value = ItemsDoing.value.map(i => i.id == event.data.id ? { ...i, status: 'Doing' } : i);
					ItemsDoing.value = ItemsDoing.value.sort(Sort());
					break;
				}
				case 'Scheduled': {
					ItemsScheduled.value = ItemsScheduled.value.map(i => i.id == event.data.id ? { ...i, status: 'Scheduled' } : i);
					ItemsScheduled.value = ItemsScheduled.value.sort(Sort());
					break;
				}
				case 'Done': {
					if(event.from.id == 'Priority'){
						event.data.priorityDate = '';
						ItemsDone.value = ItemsDone.value.map(i => i.id == event.data.id ? { ...i, status: 'Done', priorityDate: '' } : i);
					}
					else ItemsDone.value = ItemsDone.value.map(i => i.id == event.data.id ? { ...i, status: 'Done' } : i);
					ItemsDone.value = ItemsDone.value.sort(Sort()).reverse();
					break;
				}
			}
			await updateItem(event.data);
		}
	}
	const checkMove = (event: any) => {
		if (event.data.type == "Event" && !(event.to.id == "Scheduled" || event.to.id == "Done" || event.to.id == "Priority")) return false;
		if (event.from.id == "Priority" && event.to.id != "Done") return false;
	}
	const color = useColors();
	onMounted(async () => {
		DatabaseBus.on('reload', () => Reload());
	})
	onUnmounted(() => {
		DatabaseBus.off('reload');
	})
	Reload();
</script>
<template>
	<ClientOnly>
	<div class="container">
		<section style="min-width: 320px">
			<TagsContainer :color='[color.pastel.lilac]' :textColor='[color.text.lilac]' :text="`Today's Priority (${ItemsPriority.length.toString()})`" size="medium" style="margin: 8px 0px 8px 0px" />
			<VueDraggable
				v-model="ItemsPriority" 
				group="tasks" 
				@end="onListChange" 
			    :animation="150"
				ghostClass="ghost"
				:sort="false"
				@move="checkMove"
				:style="{'background-color': (color.pastel.lilac + '20'), 'height': '100%', 'padding-top': '8px', 'border-radius': '12px'}"
				id="Priority"> 
				<div v-for="item in ItemsPriority" :key="item.id">
					<TaskItem :item="item" :remove="['priorityDate']" :isHovered="Hovered == item.id" @mouseenter="Hovered = item.id"  @mouseleave="Hovered = ''"/>
				</div>
			</VueDraggable>
		</section>

		<section style="min-width: 320px; margin-left: 24px">
			<TagsContainer :color='[color.pastel.strawberry]' :textColor='[color.text.strawberry]' :text="`Todo (${ItemsTodo.length.toString()})`" size="medium" style="margin: 8px 0px 8px 0px" />
			<VueDraggable
				v-model="ItemsTodo" 
				group="tasks" 
				@end="onListChange" 
			    :animation="150"
				ghostClass="ghost"
				:sort="false"
				:move="checkMove"
				:style="{'background-color': (color.pastel.strawberry + '20'), 'height': '100%', 'padding-top': '8px', 'border-radius': '12px'}"
				id="Todo"> 
				<div v-for="item in ItemsTodo" :key="item.id">
					<TaskItem :item="item" :remove="['status']" :isHovered="Hovered == item.id" @mouseenter="Hovered = item.id"  @mouseleave="Hovered = ''"/>
				</div>
			</VueDraggable>
		</section>
		<section style="min-width: 320px; margin-left: 8px">
			<TagsContainer :color='[color.pastel.orange]' :textColor='[color.text.orange]' :text="`Doing (${ItemsDoing.length.toString()})`" size="medium" style="margin: 8px 0px 8px 0px" />
			<VueDraggable 
				v-model="ItemsDoing" 
				group="tasks" 
				@end="onListChange" 
				:animation="150"
				ghostClass="ghost"
				:sort="false"
				:move="checkMove"
				:style="{'background-color': (color.pastel.orange + '20'), 'height': '100%', 'padding-top': '8px', 'border-radius': '12px'}"
				id="Doing"> 
				<div v-for="item in ItemsDoing" :key="item.id">
					<TaskItem :item="item" :remove="['status']" :isHovered="Hovered == item.id" @mouseenter="Hovered = item.id"  @mouseleave="Hovered = ''"/>
				</div>
			</VueDraggable>
		</section>		
		<section style="min-width: 320px; margin-left: 8px">
			<TagsContainer :color='[color.pastel.blueberry]' :textColor='[color.text.blueberry]' :text="`Scheduled (${ItemsScheduled.length.toString()})`" size="medium" style="margin: 8px 0px 8px 0px" />
			<VueDraggable 
				v-model="ItemsScheduled" 
				group="tasks" 
				@end="onListChange" 
				:animation="150"
				ghostClass="ghost"
				:sort="false"
				@move="checkMove"
				:style="{'background-color': (color.pastel.blueberry + '20'), 'height': '100%', 'padding-top': '8px', 'border-radius': '12px'}"
				id="Scheduled"> 
				<div v-for="item in ItemsScheduled" :key="item.id">
					<TaskItem :item="item" :remove="['status']" :isHovered="Hovered == item.id" @mouseenter="Hovered = item.id"  @mouseleave="Hovered = ''"/>
				</div>
			</VueDraggable>
		</section>
		<section style="min-width: 320px; margin-left: 8px">
			<TagsContainer :color='[color.pastel.leaf]' :textColor='[color.text.leaf]' :text="`Done (${ItemsDone.length.toString()})`" size="medium" style="margin: 8px 0px 8px 0px" />
			<VueDraggable 
				v-model="ItemsDone" 
				group="tasks" 
				@end="onListChange" 
				:animation="150"
				ghostClass="ghost"
				:sort="false"
				@move="checkMove"
				:style="{'background-color': (color.pastel.leaf + '20'), 'height': '100%', 'padding-top': '8px', 'border-radius': '12px'}"
				id="Done"> 
				<div v-for="item in ItemsDone" :key="item.id">
					<TaskItem :item="item" :remove="['status', 'dateColor']" :isHovered="Hovered == item.id" @mouseenter="Hovered = item.id"  @mouseleave="Hovered = ''"/>
				</div>
			</VueDraggable>
		</section>
	</div>
	</ClientOnly>
</template>
<style scoped>
	.container {
		flex-direction: row;
		display: flex;
		flex-wrap: wrap;
		max-height: 100%;
	}
</style>
