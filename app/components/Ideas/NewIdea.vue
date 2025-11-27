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
		TaskModalBus.on('active', e => enabled.value = !e);
	});
	onUnmounted(() => {
		TaskModalBus.off('active');
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
	.newtask-button-container {
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1;
		box-sizing: border-box;
		border: 2px solid #00000000;
	}
</style>
