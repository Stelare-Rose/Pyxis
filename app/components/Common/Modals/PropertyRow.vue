<script setup lang=ts>
const props = defineProps<{
  icon: Component
  label: string
}>()
</script>

<template>
  <div class="property">
    <div class="row">
      <Icon
        :width="24"
        :height="24"
        style="margin-right: 8px"
      >
        <component
          :is="icon"
          v-bind="$attrs"
        />
      </Icon>
      <div class="medium-text">
        {{ label }}
      </div>
    </div>
    <div class="row-property">
      <slot />
    </div>
  </div>
</template>

<style scoped>
	.row {
		display:flex;
		width: 100%;
		align-items: center;
		flex-direction: row;
		grid-column: 1;
	}
</style>
