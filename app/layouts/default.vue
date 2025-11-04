<script setup lang=ts>
import { uiStore } from '~/stores/ui';
import hotkeys from 'hotkeys-js';

hotkeys('ctrl + n', () => {
	ShowTaskModal();
})
</script>
<template>
	<div class="container">
		<div class="topbar">
		</div>
		<div class="sidebar-container">
			<div class="sidebar">
				<Sidebar />
			</div>
			<main class="content" :class="{'can-scroll': uiStore.canscroll}" ref="content">
				<slot />
			</main>
		</div>
		<div class="bottom-right">
			<NewTask></NewTask>
		</div>
	</div>
	<TaskDetailsModal></TaskDetailsModal>
</template>

<style scoped>
	.container {
		width: 100vw;
		min-height: 100vh;
		background-color: var(--base);
		z-index: -100;
	}
	.topbar {
		width: 100vw;
		background-color: var(--cream);
		position: sticky;
		top: 0;
		z-index: 100;
		height: 36px;
		border-radius: 0 0 16px 16px;
		box-shadow: 0 4px 6px #00000010;
		flex-direction: row;
		align-items: center;
		display: flex;
	}
	.sidebar-container {
		flex: 1;
		display: flex;
		flex-direction: row;
		min-height: calc(100vh - max(60px, 6vh));
	}
	.sidebar {
		margin-top: 12px;
		background-color: var(--cream);
		box-shadow: 0 4px 6px #00000010;
		height: 216px;
		width: 32px;
		padding: 8px;
		border-radius: 0 16px 16px 0;
	}
	.content {
		z-index: 1;
		flex: 1;
		padding: 16px;
		margin-top: 12px;
		margin-left: 8px;
		margin-right: 8px;
		border-radius: 24px;
		box-shadow: 0 4px 5px #00000010;
		background-color: var(--cream);
		max-height: calc(100vh - 36px - 48px); /* full viewport minus topbar */
		overflow-y: hidden;
		scroll-behavior: smooth;
	}
	.bottom-right{
		position: fixed;
		bottom: 24px;
		right: 24px;
		z-index: 2;
	}
	.can-scroll {
		overflow-y: auto;
	}
</style>
