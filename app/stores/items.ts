import { defineStore } from 'pinia';

export type Query = { type: 'all' } | { type: 'tags', value: '' } 
export const useItemStore = defineStore('item', () => {
	const items: Ref<Item[]> = ref<Item[]>([]);
	const query: Ref<Query> = ref<Query>({ type: 'all' });

	async function loadBy(q: Query){
		query.value = q;
		await reload();
	}

	async function reload(){
		switch(query.value.type){
			case 'all':
				items.value = await GetAllItems();
				break;
			case 'tags':
				items.value = await GetAllByTag(query.value.value);
				break;
		}
	}

	async function init(){
		items.value = await GetAllItems();
		query.value = { type: 'all' };
		useDatabaseBus('reload', () => reload());
	}

	async function upsertItemWithoutDescription(item: Item){
		item.description = await getItemDescription(item);	
		upsertItem(item);
	}

	async function upsertItem(item: Item){
		// Normalize Dates in Case They're Empty
		item.startDate = item.startDate ?? null;
		item.endDate = item.endDate ?? null;
		item.priorityDate = item.priorityDate ?? null;
		console.log("Writing Item " + item.name);
		const idx = items.value.findIndex(x => x.id == item.id);
		if(idx != -1){
			items.value[idx] = item;
		}
		else {
			items.value.push(item);
		}
		
		writeFile(item, "Active/" + item.name);

	}

	async function deleteItem(item: Item){
		const idx = items.value.findIndex(x => x.id == item.id);
		if(idx != -1){
			items.value.splice(idx, 1);
			await deleteFile(item);
		}
	}

	return {items, reload, loadBy, deleteItem, upsertItem, upsertItemWithoutDescription, init};
});
