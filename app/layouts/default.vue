<script setup lang=ts>
import { uiStore } from '~/stores/ui'
import hotkeys from 'hotkeys-js'

hotkeys('ctrl + n', () => {
  ShowTaskModal()
})
</script>

<template>
  <div>
    <div class="container">
      <div class="sidebar-container">
        <div class="sidebar">
          <Sidebar />
        </div>
        <main
          ref="content"
          class="content"
          :class="{ 'can-scroll': uiStore.canscroll }"
        >
          <slot />
        </main>
      </div>
      <div class="topbar">
        <div class="left">
          <NewTask />
          <NewIdea />
        </div>
        <div class="right">
          <Done />
        </div>
      </div>
    </div>
    <TaskDetailsModal />
    <IdeaDetailsModal />
  </div>
</template>

<style scoped>
	.container {
		width: 100vw;
		min-height: 100vh;
		background-color: var(--base);
		z-index: 100;
	}
	.topbar {
		width: calc(100vw - 16px);
		background-color: var(--cream);
		bottom: 0;
		position: absolute;
		z-index: 1;
		height: 36px;
		margin: 0 8px;
		border-radius: 16px 16px 0 0;
		box-shadow: 0 4px 6px #00000010;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		display: flex;
		padding: 8px 12px;
		box-sizing: border-box;
	}
	.left {
		gap: 12px;
		display: flex;
		align-items: center;
	}
	.right {
		display: flex;
		align-items: center;
	}
	.sidebar-container {
		flex: 1;
		display: flex;
		flex-direction: row;
		min-height: calc(100vh - max(60px, 6vh));
	}
	.sidebar {
		margin-top: 8px;
		background-color: var(--cream);
		box-shadow: 0 4px 6px #00000010;
		height: 216px;
		width: 32px;
		padding: 8px;
		border-radius: 0 16px 16px 0;
	}
	.content {
		z-index: 2;
		flex: 1;
		padding: 16px;
		margin-top: 8px;
		margin-bottom: 4px;
		margin-left: 8px;
		margin-right: 8px;
		border-radius: 24px;
		box-shadow: 0 4px 5px #00000010;
		background-color: var(--cream);
		height: calc(100vh - 36px - 48px); /* full viewport minus topbar */
		overflow-y: hidden;
	}
	.can-scroll {
		overflow-y: auto;
	}
</style>
