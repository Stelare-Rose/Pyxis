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

	return {items, reload, loadBy, init};
});
