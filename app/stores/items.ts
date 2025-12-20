import { defineStore } from 'pinia';

export const useItemStore = defineStore('item', () => {
	const items: Ref<Item[]> = ref<Item[]>([]);
	async function reload(){
		items.value = await GetAllItems();
	}

	async function init(){
		items.value = await GetAllItems();
		useDatabaseBus('reload', () => reload());
	}

	return {items, reload, init};
});
