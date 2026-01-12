<script setup lang=ts>
import { MilkdownProvider } from '@milkdown/vue'

const props = defineProps({
  modelValue: {
    type: String,
  },
  id: String,
})
const emit = defineEmits(['update:modelValue'])

const internalValue = computed({
  get() {
    return props.modelValue
  },
  set(value: string) {
    return emit('update:modelValue', value)
  },
})
</script>

<template>
  <MilkdownProvider>
    <MilkdownEditor
      :key="id"
      v-model="internalValue"
    />
  </MilkdownProvider>
</template>
