<script setup lang="ts">
	import { VueDraggable } from 'vue-draggable-plus'
	let ItemsTodo = ref<IndexItem[]>([]);
	let ItemsDoing = ref<IndexItem[]>([]);
	let ItemsScheduled = ref<IndexItem[]>([]);
	let ItemsDone = ref<IndexItem[]>([]);
	let Hovered = ref<string>();
	const Reload = async () => {
		ItemsTodo.value = await GetAllByStatus('Todo');
		ItemsDoing.value = await GetAllByStatus('Doing');
		ItemsScheduled.value = await GetAllByStatus('Scheduled');
		ItemsDone.value = (await GetAllByStatus('Done')).reverse();
	}
	const onListChange = async (event: any) => {
		Hovered.value = '';
		if (event.from.id == event.to.id) return;
		if (event.data) {
			event.data.status = event.to.id;
			switch(event.to.id){
				case 'Todo': {
					ItemsTodo.value = ItemsTodo.value.sort(Sort());
					break;
				}
				case 'Doing': {
					ItemsDoing.value = ItemsDoing.value.sort(Sort());
					break;
				}
				case 'Scheduled': {
					ItemsScheduled.value = ItemsScheduled.value.sort(Sort());
					break;
				}
				case 'Done': {
					ItemsDone.value = ItemsDone.value.sort(Sort()).reverse();
					break;
				}
			}
			await updateItem(event.data);
		}
		// UpdateItem(id), GetAllByStatus('event.to.id') and 'event.from.id'
	}
	const checkMove = (event: any) => {
		console.log(event);
		if (event.data.type == "Event" && !(event.to.id == "Scheduled" || event.to.id == "Done")) return false;
	}
	const color = useColors();
	Reload();
</script>
<template>
	<ClientOnly>
	<div class="container">
		<section>
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
		<section style="margin-left: 8px">
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
		<section style="margin-left: 8px">
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
		<section style="margin-left: 8px">
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
