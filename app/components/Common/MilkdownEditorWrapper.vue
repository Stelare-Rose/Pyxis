<script setup lang=ts>
	const props = defineProps({
	  modelValue: {
	  	type: String,
	  },
	  id: String,
	})
	import { MilkdownProvider } from "@milkdown/vue";
	const emit = defineEmits(['update:modelValue']);

	const internalValue = computed({
	get() {
		return props.modelValue;
	},
	set(value: string) {
		return emit('update:modelValue', value);
	},
});

</script>
<template>
  <MilkdownProvider>
    <MilkdownEditor v-model="internalValue" :key='id'/>
  </MilkdownProvider>
</template>
