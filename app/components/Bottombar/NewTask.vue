<script setup lang=ts>
	const enabled = ref(true);
	const hovered = ref(false);
	const color = useColors();
	const clicked = () => {
		console.log("Hello");
		if(enabled.value){
			ShowTaskModal();
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
		<ClipboardText 
			:strokeColor="hovered ? color.text.orange : '#000'"
		></ClipboardText>
	</Icon>
</template>
<style scoped>

</style>
