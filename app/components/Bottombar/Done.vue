<script setup lang=ts>
import { Dropdown } from 'floating-vue'
import 'floating-vue/dist/style.css'

const enabled = uiStore.canscroll

const isOpen = ref(false)
const hovered = ref(false)
const Hovered = ref()
const color = useColors()
const { itemsDone } = storeToRefs(useItemStore())
const clicked = () => {
  if (enabled) {
    console.log('This should open the thingy')
    isOpen.value = true
  }
}
</script>

<template>
  <Dropdown :placement="'top-end'">
    <Icon
      :height="24"
      :width="24"
      @click="clicked"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
    >
      <Check
        :stroke-color="hovered ? color.text.leaf : '#000'"
      />
    </Icon>
    <template #popper>
      <section :style="{ 'background-color': (color.pastel.leaf + '20'), 'max-height': '30%', 'overflow-y': 'scroll', 'padding-top': '8px', 'border-radius': '12px' }">
        <TagsContainer
          :color="[color.pastel.leaf]"
          :text-color="[color.text.leaf]"
          :text="`Done (${itemsDone.length.toString()})`"
          size="medium"
          style="margin: 8px 0px 8px 16px"
        />
        <div
          v-for="item in itemsDone.slice(0, 20)"
          :key="item.id + item.fingerprint"
        >
          <TaskItem
            :item="item"
            :remove="['status', 'dateColor']"
            :is-hovered="Hovered == item.id"
            @mouseenter="Hovered = item.id"
            @mouseleave="Hovered = ''"
          />
        </div>
      </section>
    </template>
  </Dropdown>
</template>

<style>
.v-popper--theme-dropdown .v-popper__wrapper {
	overflow-y: scroll;
}
.v-popper--theme-dropdown .v-popper__inner {
	max-height: 50vh;
	background-color: var(--cream);
	color: black;
	border-radius: 6px;
	padding: 8px;
	border: 1px solid var(--lilac);
	box-shadow: 0 6px 30px rgba(0, 0, 0, .1);
}
.v-popper--theme-dropdown .v-popper__arrow-inner {
	visibility: visible;
	border-color: var(--cream);
}
.v-popper--theme-dropdown .v-popper__arrow-outer {
	border-color: var(--lilac);
}
</style>
