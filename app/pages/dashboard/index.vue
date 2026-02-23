<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import moment from 'moment'
import { useItemStore } from '~/stores/items'

const today = moment().endOf('day').seconds(0).milliseconds(0).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
const ItemsTodo = computed(() => buckets.value.Todo)
const ItemsDoing = computed(() => buckets.value.Doing)
const ItemsScheduled = computed(() => buckets.value.Scheduled)
const ItemsPriority = computed(() => buckets.value.Priority)
const { items } = storeToRefs(useItemStore())

type Status = 'Todo' | 'Doing' | 'Scheduled' | 'Done' | 'Priority'
const buckets = computed(() => {
  const result: Record<Status, Item[]> = {
    Todo: [],
    Doing: [],
    Scheduled: [],
    Done: [],
    Priority: [],
  }

  for (const item of items.value) {
    if (moment(item.priorityDate).startOf('day').unix() == moment().startOf('day').unix()) {
      result['Priority'].push(item)
      continue
    }
    result[item.status].push(item)
  }
  return result
})

const onListChange = async (event: any) => {
  Hovered.value = ''
  const item = { ...event.data }
  if (event.from.id == event.to.id) return

  if (event.from.id == 'Priority') event.data.priorityDate = ''
  if (event.to.id == 'Priority') {
    item.status = event.from.id
    item.priorityDate = today
    await useItemStore().upsertItemWithoutDescription(item)
    return
  }
  if (item) {
    item.status = event.to.id
    switch (event.to.id) {
      case 'Done': {
        if (event.from.id == 'Priority') {
          item.priorityDate = ''
        }
        break
      }
    }
    await useItemStore().upsertItemWithoutDescription(item)
  }
}

const checkMove = (event: any) => {
  if (event.data.type == 'Event' && !(event.to.id == 'Scheduled' || event.to.id == 'Done' || event.to.id == 'Priority')) return false
}

const color = useColors()
const Hovered = ref<string>()

onBeforeMount(async () => {
  await useItemStore().loadBy({ type: 'all' })
})
</script>

<template>
  <div class="container">
    <section style="min-width: 320px">
      <TagsContainer
        :color="[color.pastel.lilac]"
        :text-color="[color.text.lilac]"
        :text="`Today's Priority (${ItemsPriority.length.toString()})`"
        size="medium"
        style="margin: 8px 0px 8px 0px"
      />
      <VueDraggable
        id="Priority"
        v-model="ItemsPriority"
        group="tasks"
        :animation="150"
        ghost-class="ghost"
        :sort="false"
        :style="{ 'background-color': (color.pastel.lilac + '20'), 'height': '100%', 'padding-top': '8px', 'border-radius': '12px' }"
        @end="onListChange"
        @move="checkMove"
      >
        <div
          v-for="item in ItemsPriority"
          :key="item.id + item.fingerprint"
        >
          <TaskItem
            is-priority
            :item="item"
            :remove="['priorityDate']"
            :is-hovered="Hovered == item.id"
            @mouseenter="Hovered = item.id"
            @mouseleave="Hovered = ''"
          />
        </div>
      </VueDraggable>
    </section>

    <section style="min-width: 320px; margin-left: 24px">
      <TagsContainer
        :color="[color.pastel.strawberry]"
        :text-color="[color.text.strawberry]"
        :text="`Todo (${ItemsTodo.length.toString()})`"
        size="medium"
        style="margin: 8px 0px 8px 0px"
      />
      <VueDraggable
        id="Todo"
        v-model="ItemsTodo"
        group="tasks"
        :animation="150"
        ghost-class="ghost"
        :sort="false"
        :move="checkMove"
        :style="{ 'background-color': (color.pastel.strawberry + '20'), 'height': '100%', 'padding-top': '8px', 'border-radius': '12px' }"
        @end="onListChange"
      >
        <div
          v-for="item in ItemsTodo"
          :key="item.id + item.fingerprint"
        >
          <TaskItem
            :item="item"
            :remove="['status']"
            :is-hovered="Hovered == item.id"
            @mouseenter="Hovered = item.id"
            @mouseleave="Hovered = ''"
          />
        </div>
      </VueDraggable>
    </section>
    <section style="min-width: 320px; margin-left: 8px">
      <TagsContainer
        :color="[color.pastel.orange]"
        :text-color="[color.text.orange]"
        :text="`Doing (${ItemsDoing.length.toString()})`"
        size="medium"
        style="margin: 8px 0px 8px 0px"
      />
      <VueDraggable
        id="Doing"
        v-model="ItemsDoing"
        group="tasks"
        :animation="150"
        ghost-class="ghost"
        :sort="false"
        :move="checkMove"
        :style="{ 'background-color': (color.pastel.orange + '20'), 'height': '100%', 'padding-top': '8px', 'border-radius': '12px' }"
        @end="onListChange"
      >
        <div
          v-for="item in ItemsDoing"
          :key="item.id + item.fingerprint"
        >
          <TaskItem
            :item="item"
            :remove="['status']"
            :is-hovered="Hovered == item.id"
            @mouseenter="Hovered = item.id"
            @mouseleave="Hovered = ''"
          />
        </div>
      </VueDraggable>
    </section>
    <section style="min-width: 320px; margin-left: 8px">
      <TagsContainer
        :color="[color.pastel.blueberry]"
        :text-color="[color.text.blueberry]"
        :text="`Scheduled (${ItemsScheduled.length.toString()})`"
        size="medium"
        style="margin: 8px 0px 8px 0px"
      />
      <VueDraggable
        id="Scheduled"
        v-model="ItemsScheduled"
        group="tasks"
        :animation="150"
        ghost-class="ghost"
        :sort="false"
        :style="{ 'background-color': (color.pastel.blueberry + '20'), 'height': '100%', 'padding-top': '8px', 'border-radius': '12px' }"
        @end="onListChange"
        @move="checkMove"
      >
        <div
          v-for="item in ItemsScheduled"
          :key="item.id + item.fingerprint"
        >
          <TaskItem
            :item="item"
            :remove="['status']"
            :is-hovered="Hovered == item.id"
            @mouseenter="Hovered = item.id"
            @mouseleave="Hovered = ''"
          />
        </div>
      </VueDraggable>
    </section>
  </div>
</template>

<style scoped>
	.container {
		flex-direction: row;
		display: flex;
		flex-wrap: wrap;
		max-height: 100%;
	}
</style>
