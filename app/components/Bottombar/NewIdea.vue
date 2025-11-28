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

	});
	onBeforeUnmount(() => {

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
