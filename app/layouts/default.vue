<template>
	<div class="container">
		<div class="topbar">
		</div>
		<div class="sidebar-container">
			<div class="sidebar">
			</div>
			<main class="content">
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
		background-color: var(--cream);
		z-index: -100;
	}
	.topbar {
		width: 100vw;
		min-height: max(60px, 6vh);
		background-color: var(--base);
		box-shadow: 0 4px 5px #00000040;
		position: sticky;
		top: 0;
		z-index: 100;
	}
	.sidebar-container {
		flex: 1;
		display: flex;
		flex-direction: row;
		min-height: calc(100vh - max(60px, 6vh));
	}
	.sidebar {
		margin-top: 24px;
		background-color: var(--base);
		box-shadow: 0 4px 5px #00000040;
		height: 216px;
		width: 32px;
		padding: 8px;
		border-radius: 0 16px 16px 0;
		position: sticky;
		top: calc(max(80px, 9vh) + 24px);
	}
	.content {
		z-index: 1;
		flex: 1;
		padding: 8px;
		-webkit-overflow-scrolling: touch;
	}
	.bottom-right{
		position: fixed;
		bottom: 24px;
		right: 24px;
		z-index: 2;
	}
</style>
