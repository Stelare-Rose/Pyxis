<script setup lang="ts">
	import { VueDraggable } from 'vue-draggable-plus'
	import moment from 'moment';
	import { useItemStore } from '~/stores/items';
	const today = moment().endOf('day').seconds(0).milliseconds(0).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
	let ItemsTodo = computed(() =>  buckets.value.Todo);
	let ItemsDoing = computed(() =>  buckets.value.Doing);
	let ItemsScheduled = computed(() =>  buckets.value.Scheduled);
	let ItemsDone = computed(() =>  buckets.value.Done);
	let ItemsPriority = computed(() =>  buckets.value.Priority);
	const { items } = storeToRefs(useItemStore());

	type Status = 'Todo' | 'Doing' | 'Scheduled' | 'Done' | 'Priority'
	const buckets = computed(() => {
		const result: Record<Status, Item[]> = {
			Todo: [],
			Doing: [],
			Scheduled: [],
			Done: [],
			Priority: [],
		};

		for(const item of items.value){
			if(moment(item.priorityDate).date() == moment().date()){
				result["Priority"].push(item);
				continue;
			}
			result[item.status].push(item);
		}
		return result;
	})

	const onListChange = async (event: any) => {
		Hovered.value = '';
		if (event.from.id == event.to.id) return;

		if (event.from.id == 'Priority') event.data.priorityDate = '';
		if (event.to.id == 'Priority'){
			event.data.status = event.from.id;
			event.data.priorityDate = today;
			await updateItem(event.data);
			return;
		}
		if (event.data) {
			event.data.status = event.to.id;
			switch(event.to.id){
				case 'Done': {
					if(event.from.id == 'Priority'){
						event.data.priorityDate = '';
					}
					event.data.completedDate = today;
					break;
				}
			}
			await updateItem(event.data);
		}
	}

	const checkMove = (event: any) => {
		if (event.data.type == "Event" && !(event.to.id == "Scheduled" || event.to.id == "Done" || event.to.id == "Priority")) return false;
	}
	
	const color = useColors();
	let Hovered = ref<string>();

	onBeforeMount(async () => {
		await useItemStore().loadBy({ type: 'all' });
	})
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
				<div v-for="item in ItemsPriority" :key="item.id + item.fingerprint">
					<TaskItem isPriority :item="item" :remove="['priorityDate']" :isHovered="Hovered == item.id" @mouseenter="Hovered = item.id"  @mouseleave="Hovered = ''"/>
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
				<div v-for="item in ItemsTodo" :key="item.id + item.fingerprint">
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
				<div v-for="item in ItemsDoing" :key="item.id + item.fingerprint">
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
				<div v-for="item in ItemsScheduled" :key="item.id + item.fingerprint">
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
				<div v-for="item in ItemsDone.slice(0, 20)" :key="item.id + item.fingerprint">
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
