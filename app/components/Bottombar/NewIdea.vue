<script setup lang=ts>
	const enabled = ref(true);
	const hovered = ref(false);
	const color = useColors();
	const clicked = () => {
		if(enabled.value){

		}
	}
	onMounted(() => {
		useTaskModalBus('active', e => enabled.value = !e);
	});
	onBeforeUnmount(() => {
		RemoveTaskModalBus('active');
	});
</script>
<template>
	<Icon :height='24' :width='24' @click="clicked" @mouseenter="hovered = true" @mouseleave="hovered = false">
		<SquareExclamation 
			:strokeColor="hovered ? color.text.blueberry : '#000'"
		></SquareExclamation>
	</Icon>
</template>
<style scoped>

</style>
