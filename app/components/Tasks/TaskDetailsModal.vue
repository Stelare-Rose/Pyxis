<script setup lang=ts>
// Imports
import Multiselect from '@vueform/multiselect'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import { v4 as uuidv4 } from 'uuid'
import { uiStore } from '~/stores/ui'
import hotkeys from 'hotkeys-js'
// Style Imports
import '@vuepic/vue-datepicker/dist/main.css'
import '@vueform/multiselect/themes/default.css'
import FileInfo from '../Icons/File-Info.vue'
import Question from '../Icons/Question.vue'
import Check from '../Icons/Check.vue'
import CalendarCheck from '../Icons/CalendarCheck.vue'
import CalendarExclamation from '../Icons/CalendarExclamation.vue'
import Star from '../Icons/Star.vue'
import Tags from '../Icons/Tags.vue'
import { debounce } from 'lodash'

// Types
interface MultiselectStatus {
  value: string[]
  label: ItemStatus
  color: string
}

// Shortcuts
hotkeys.filter = () => true
hotkeys('esc', (e) => {
  if (e.repeat) return
  disable()
})

// Styling
const trashColor = ref('#000')
const colors = useColors()

// Input Bindings
const item = ref<Item>({ id: '0', name: '', type: 'Task', status: 'Todo', fingerprint: '0' })
const titleInput = ref()
const type = ref<{ value: string[], label: string, color: string }>({ value: ['Task', 'orange,lemon'], label: 'Task', color: 'orange,lemon' })
const status = ref<{ value: string[], label: string, color: string }>({ value: ['Todo', 'strawberry'], label: 'Todo', color: 'strawberry' })
const startDate = ref()
const endDate = ref()
const priorityDate = ref()
const completedDate = ref()
const tagList = computed({
  get: () => {
    return item.value.tags
      ?.flatMap(x => tagsOptions.value.find(t => t.label == x.tag))
      ?.filter((t): t is MultiselectTags => t !== undefined)
  },
  set: (val: MultiselectTags[]) => {
    const mapped = val.map((x: MultiselectTags | undefined) => tags.value.find(t => t.id == x?.value)).filter((t): t is Tag => t !== undefined)
    item.value.tags = mapped.length > 0 ? mapped : undefined
  },
})
const description = ref<string>()

// Default Values
const { tags } = storeToRefs(useTagsStore())
const tagsOptions = ref<MultiselectTags[]>(tags.value.map(x => ({ label: x.tag, value: x.id, color: x.color })))
const startTime = ref({ hours: 23, minutes: 59 })
const types = ref([
  { value: ['Task', 'orange, lemon'], label: 'Task', color: 'orange,lemon' },
  { value: ['Event', 'blueberry, grape'], label: 'Event', color: 'blueberry,grape' },
])
const statuses = ref([
  { value: ['Todo', 'strawberry'], label: 'Todo', color: 'strawberry', disabled: type.value.label == 'Event' },
  { value: ['Doing', 'orange'], label: 'Doing', color: 'orange', disabled: type.value.label == 'Event' },
  { value: ['Scheduled', 'blueberry'], label: 'Scheduled', color: 'blueberry' },
  { value: ['Done', 'mint'], label: 'Done', color: 'mint' },
])

// Data Bindings
const UpdateType = (option: any) => {
  statuses.value = statuses.value.map((x) => {
    x.disabled = (x.label == 'Todo' || x.label == 'Doing') && option.label == 'Event'
    return x
  })
  if (option.label == 'Event' && status.value.label == 'Todo') {
    status.value = { value: ['Scheduled', 'blueberry'], label: 'Scheduled', color: 'blueberry' }
    item.value.status = isStatus(status.value.label) ? status.value.label : 'Todo'
  }
  item.value.type = option.label
}
const UpdateStatus = (option: MultiselectStatus) => {
  item.value.status = option.label
}

const { updateDate } = useDateUpdate(item)

// Event Handlers
const enabled = ref(false)
const event = async (e: boolean) => {
  enabled.value = e
  if (e) uiStore.canscroll = false
  else {
    uiStore.canscroll = true
    item.value = { id: '0', name: '', type: 'Task', status: 'Todo', fingerprint: '0' }
    return
  }
  tagsOptions.value = tags.value.map(x => ({ label: x.tag, value: x.id, color: x.color, trackBy: x.tag }))
  if (item.value.id == '0') {
    description.value = ''
    item.value.id = uuidv4()
    nextTick(() => {
      titleInput.value.focus()
    })
    await loadItem(item.value)
  }
}
const disable = async () => {
  if (item.value.name && item.value.type && item.value.status) await SaveData()
  HideTaskModal()
}
const loadItem = async (i: Item) => {
  description.value = await getItemDescription(i)
  item.value = { ...i }
  type.value = types.value.find(x => x.label == item.value.type) ?? { value: ['Task', 'orange,lemon'], label: 'Task', color: 'orange,lemon' }
  status.value = statuses.value.find(x => x.label == item.value.status) ?? { value: ['Todo', 'strawberry'], label: 'Todo', color: 'strawberry' }
  startDate.value = item.value.startDate
  endDate.value = item.value.endDate
  priorityDate.value = item.value.priorityDate
  completedDate.value = item.value.completedDate
}

// Event Listeners
onMounted(async () => {
  useTaskModalBus('item', i => loadItem(i))
  useTaskModalBus('active', e => event(e))
  useDatabaseBus('reload', async () => tags.value = await GetAllTags())
})
onBeforeUnmount(() => {
  RemoveTaskModalBus('item')
  RemoveTaskModalBus('active')
  RemoveDatabaseBus('reload')
})

// Filesystem Bindings
watch(description, async () => {
  saveDebounced()
})

const saveDebounced = debounce(async () => {
  if (item.value.name && item.value.type && item.value.status) await SaveData()
}, 500)

const SaveData = async () => {
  item.value.description = description.value
  await useItemStore().upsertItem(item.value)
}
const Delete = async () => {
  await useItemStore().deleteItem(item.value)
  HideTaskModal()
}
</script>

<template>
  <transition name="modal">
    <section
      v-if="enabled"
      class="modal-background"
      @click.self="disable"
    >
      <transition
        name="modal-content"
        appear
      >
        <section
          v-if="enabled"
          class="modal"
        >
          <section class="modal-data">
            <section class="modal-metadata">
              <input
                ref="titleInput"
                v-model="item.name"
                class="large-text-input"
                placeholder="Title"
              >
              <div class="properties">
                <PropertyRow
                  :icon="FileInfo"
                  label="Type"
                >
                  <Multiselect
                    v-model="type"
                    :options="types"
                    mode="single"
                    :can-deselect="false"
                    :can-clear="false"
                    :object="true"
                    class="hovered"
                    :caret="false"
                    @change="UpdateType"
                  >
                    <template #singlelabel="{ value }">
                      <TagsContainer
                        :key="value.value"
                        style="margin-right: auto; margin-left: 8px"
                        :color="getRawColor(value.color)"
                        :text-color="getRawTextColor(value.color)"
                        :text="value.label"
                      />
                    </template>
                    <template #option="{ option }">
                      <TagsContainer
                        :key="option.value"
                        :color="getRawColor(option.color)"
                        :text-color="getRawTextColor(option.color)"
                        :text="option.label"
                      />
                    </template>
                  </Multiselect>
                </PropertyRow>
                <PropertyRow
                  :icon="Question"
                  label="Status"
                >
                  <Multiselect
                    v-model="status"
                    :options="statuses"
                    mode="single"
                    :can-deselect="false"
                    :can-clear="false"
                    :object="true"
                    :caret="false"
                    @change="UpdateStatus"
                  >
                    <template #singlelabel="{ value }">
                      <TagsContainer
                        :key="value.value"
                        style="margin-right: auto; margin-left: 8px"
                        :color="getStatusColor(value.label)"
                        :text-color="getStatusTextColor(value.label)"
                        :text="value.label"
                      />
                    </template>
                    <template #option="{ option }">
                      <TagsContainer
                        :key="option.value"
                        :color="getStatusColor(option.label)"
                        :text-color="getStatusTextColor(option.label)"
                        :text="option.label"
                      />
                    </template>
                  </Multiselect>
                </PropertyRow>
                <PropertyRow
                  v-if="item.status == 'Done'"
                  :icon="Check"
                  :stroke-color="colors.text.mint"
                  label="Completed Date"
                >
                  <vue-date-picker
                    v-model="completedDate"
                    :text-input="{ maskFormat: 'DD/MM/YYYY' }"
                    :formats="{ input: 'dd/MM/yyyy' }"
                    :time-config="{ enableTimePicker: false }"
                    @update:model-value="val => updateDate('completedDate', val)"
                  />
                </PropertyRow>
                <PropertyRow
                  :icon="CalendarCheck"
                  :stroke-color="colors.text.leaf"
                  label="Start Date"
                >
                  <vue-date-picker
                    v-model="startDate"
                    :text-input="{ maskFormat: 'DD/MM/YYYY, hh:mm' }"
                    :formats="{ input: 'dd/MM/yyyy, HH:mm' }"
                    :time-config="{ startTime: startTime }"
                    @update:model-value="val => updateDate('startDate', val)"
                  />
                </PropertyRow>
                <PropertyRow
                  :icon="CalendarExclamation"
                  :stroke-color="colors.text.strawberry"
                  label="End Date"
                >
                  <vue-date-picker
                    v-model="endDate"
                    :text-input="{ maskFormat: 'DD/MM/YYYY, hh:mm' }"
                    :formats="{ input: 'dd/MM/yyyy, HH:mm' }"
                    :time-config="{ startTime: startTime }"
                    @update:model-value="val => updateDate('endDate', val)"
                  />
                </PropertyRow>
                <PropertyRow
                  :icon="Star"
                  :stroke-color="colors.text.lilac"
                  label="Priority Date"
                >
                  <vue-date-picker
                    v-model="priorityDate"
                    :text-input="{ maskFormat: 'DD/MM/YYYY' }"
                    :formats="{ input: 'dd/MM/yyyy' }"
                    :time-config="{ enableTimePicker: false }"
                    @update:model-value="val => updateDate('priorityDate', val)"
                  />
                </PropertyRow>
                <PropertyRow
                  :icon="Tags"
                  label="Tags"
                >
                  <Multiselect
                    v-model="tagList"
                    :placeholder="'Click to select tags..'"
                    :options="tagsOptions"
                    mode="tags"
                    :object="true"
                    :close-on-select="false"
                    :caret="false"
                    :searchable="true"
                  >
                    <template #tag="{ option, handleTagRemove }">
                      <TagsContainer
                        :key="Math.random()"
                        style="margin-right: 8px"
                        :color="getTagColor(option)"
                        :text-color="getTagTextColor(option)"
                        :text="option.label ?? option.tag"
                        @click="handleTagRemove(option, $event)"
                      />
                    </template>
                    <template #option="{ option }">
                      <TagsContainer
                        :key="Math.random()"
                        :color="getTagColor(option)"
                        :text-color="getTagTextColor(option)"
                        :text="option.label"
                      />
                    </template>
                  </Multiselect>
                </PropertyRow>
              </div>
            </section>
            <section class="modal-description">
              <MilkdownEditorWrapper
                :id="item.id"
                :key="item.id"
                v-model="description"
              />
            </section>
          </section>
          <section class="modal-bottom">
            <Icon
              :height="20"
              :width="20"
              @mouseenter="trashColor = '#CF8282'"
              @mouseleave="trashColor ='#000'"
              @click="Delete"
            >
              <Trash :stroke-color="trashColor" />
            </Icon>
          </section>
        </section>
      </transition>
    </section>
  </transition>
</template>

<style>
	.multiselect-tags-search {
		background-color: var(--foam);
	}
</style>

<style scoped>
	.dp__theme_light {
		--dp-background-color: var(--foam);
		--dp-text-color: #212121;
		--dp-hover-color: #CF8282;
		--dp-hover-text-color: #212121;
		--dp-hover-icon-color: #959595;
		--dp-primary-color: #CF8282;
		--dp-primary-disabled-color: #6bacea;
		--dp-primary-text-color: #f8f5f5;
		--dp-secondary-color: #c0c4cc;
		--dp-border-color: var(--foam);
		--dp-menu-border-color: #EDB7CA;
		--dp-border-color-hover: #EDB7CA;
		--dp-border-color-focus: #EDB7CA;
		--dp-disabled-color: #f6f6f6;
		--dp-scroll-bar-background: #f3f3f3;
		--dp-scroll-bar-color: #959595;
		--dp-success-color: #76d275;
		--dp-success-color-disabled: #a3d9b1;
		--dp-icon-color: #959595;
		--dp-danger-color: #ff6f60;
		--dp-marker-color: #ff6f60;
		--dp-tooltip-color: #fafafa;
		--dp-disabled-color-text: #8e8e8e;
		--dp-highlight-color: rgb(25 118 210 / 10%);
		--dp-range-between-dates-background-color: var(--dp-hover-color, #f3f3f3);
		--dp-range-between-dates-text-color: var(--dp-hover-text-color, #212121);
		--dp-range-between-border-color: var(--dp-hover-color, #f3f3f3);
	}

	.multiselect {
		background-color: var(--foam);
		border: 1px #EDB7CA;
		width: 100%;
	}

	.properties {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.5rem 1rem;
		align-items: center;
		margin-top: 8px;
	}
	.property {
		display: contents;
	}
	.row {
		display:flex;
		width: 100%;
		align-items: center;
		flex-direction: row;
		grid-column: 1;
	}
	.row-property {
		grid-column: 2;
		display:flex;
		width: 100%;
		align-items: center;
		flex-direction: row;
	}
	.medium-text{
		font-size: 12pt;
	}
	.modal-metadata {
		width: 40%;
		height: 100%;
		box-sizing: border-box;
		border-right: 2px solid var(--base);
		padding: 12px;
	}
	.modal-description{
		flex: 1;
		box-sizing: border-box;
		height: 100%;
		overflow-y: scroll;
		overflow-x: hidden;
		padding-left: 8px;
	}
	.large-text-input {
		font-size: 20pt;
		background: none;
		border: none;
		width: 100%;
		outline: none;
	}
	.modal {
		width: 75%;
		height: 80%;
		background-color: var(--foam);
		border-radius: 24px;
		z-index: 10001;
		padding: 32px 16px;
	}
	.modal-data {
		display: flex;
		flex-direction: row;
		height: 100%;
	}
	.modal-background {
		width: 100vw;
		height: 100vh;
		position: fixed;
		background: rgba(0,0,0,0.3);
		top: 0;
		left: 0;
		z-index: 10000;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.modal-content-enter-from, .modal-content-leave-to {
		transform: scale(0.9);
		opacity: 0;
	}
	.modal-content-enter-to, .modal-content-leave-from {
		transform: scale(1);
		opacity: 1;
	}
	.modal-content-enter-active, .modal-content-leave-active {
		transition: all 0.2s ease;
	}
	.modal-enter-from, .modal-leave-to {
		background: rgba(0,0,0,0);
		opacity: 0;
	}
	.modal-enter-to, .modal-leave-from {
		background: rgba(0,0,0,0.3);
		opacity: 1;
	}
	.modal-enter-active, .modal-leave-active {
		transition: all 0.2s ease;
	}
	.fade-enter-from, .fade-leave-to {
		background: rgba(0,0,0,0);
		opacity: 0;
	}
	.fade-enter-to, .fade-leave-from {
		background: rgba(0,0,0,0.3);
		opacity: 1;
	}
	.fade-enter-active, .fade-leave-active {
		transition: all 0.2s ease;
	}
</style>
