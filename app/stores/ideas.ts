import { defineStore } from 'pinia'

export const useIdeaStore = defineStore('idea', () => {
  const ideas: Ref<Idea[]> = ref<Idea[]>([])
  const query: Ref<Query> = ref<Query>({ type: 'all' })
  const queriedItems = computed(() => {
    const q = query.value

    switch (q.type) {
      case 'tags':
        return ideas.value.filter(item => item.tags?.some(t => t.id === q.value))
    }

    return ideas.value
  })

  async function loadBy(q: Query) {
    query.value = q
    await reload()
  }

  async function reload() {
    ideas.value = await GetAllIdeas()
  }

  async function init() {
    console.log('Initializing Ideas')
    ideas.value = await GetAllIdeas()
    query.value = { type: 'all' }
    useDatabaseBus('reload', () => reload())
  }

  /*
	async function upsertItemWithoutDescription(item: Item){
		item.description = await getItemDescription(item);
		upsertItem(item);
	}

	async function upsertItem(item: Item){
		if(item.description === undefined) item.description = await getItemDescription(item);
		// Normalize Dates in Case They're Empty
		item.startDate = item.startDate ?? null;
		item.endDate = item.endDate ?? null;
		item.priorityDate = item.priorityDate ?? null;

		const idx = items.value.findIndex(x => x.id == item.id);
		if(idx != -1){
			// Item Checks

			// Note we use the database version to avoid accidental reference issues
			CompletedCheck(item, await GetById(item.id));
			items.value[idx] = item;
		}
		else {
			CompletedCheck(item);
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
	*/

  return { ideas, queriedItems, reload, loadBy, init }
})
