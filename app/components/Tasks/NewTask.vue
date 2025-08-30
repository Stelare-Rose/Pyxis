<script setup lang=ts>
	const enabled = ref(true);
	const hovered = ref(false);
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
	<div class="newtask-button-container" :class="{'hovered-animation': hovered && enabled}" @click="clicked" @mouseenter="hovered=true" @mouseleave="hovered=false">
		<Icon :height='48' :width='48'>
			<ClipboardText></ClipboardText>
		</Icon>
	</div>
</template>
<style scoped>
	.newtask-button-container {
		border-radius: 50%;
		background-color: var(--foam);
		width: 72px;
		height: 72px;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1;
		box-sizing: border-box;
		border: 2px solid #00000000;
	}
	.newtask-button-container::before {
		content: '';
		height: 100%;
		width: 100%;
		position: absolute;
		box-shadow: 0 4px 5px #00000040;
		border-radius: 50%;
		z-index: -2;
	}

	.newtask-button-container::after {
		--angle: 0deg;
		height: 100%;
		width: 100%;
		background-image: conic-gradient(from var(--angle), var(--strawberry), var(--lemon), var(--leaf), var(--mint), var(--sky), var(--grape), var(--lavender), var(--pink), var(--strawberry));
		opacity: 0;
		padding: 2px;
		content: '';
		position: absolute;
		z-index: -1;
		border-radius: 50%;
	}

	.hovered-animation::after {
		opacity: 1;
		animation: 1s spin linear infinite;
		filter: blur(2px);
	}

	@keyframes spin {
		from {
			--angle: 0deg;
		} to {
			--angle: 360deg;
		}
	}

	@property --angle {
		syntax: "<angle>";
		initial-value: 0deg;
		inherits: false;
	}

</style>
