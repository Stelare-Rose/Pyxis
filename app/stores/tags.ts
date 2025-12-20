export const useTagsStore = defineStore('tags', () => {
	const tags: Ref<Tag[]> = ref<Tag[]>([]);

	async function reload(){
		tags.value = await GetAllTags();
		console.log(tags);
	}

	async function init(){
		tags.value = await GetAllTags();
		useDatabaseBus('reload', async () => await reload());
	}

	return { tags, reload, init };
});
