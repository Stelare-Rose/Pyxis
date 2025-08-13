<script setup lang=ts>
	import moment from 'moment';
	const props = defineProps<{
		task: IndexItem,
	}>()
	const task = props.task
	let afterTasks: (undefined | IndexItem)[];
	if(task.afterTask){
		afterTasks = await Promise.all(task.afterTask.map(x => SearchCache(x)));
	}
</script>

<template>
	<div class="container">
	<div>Type = {{task.type}}</div>
	<div>Name = {{task.name}}</div>
	<div>Status = {{task.status}}</div>
	<div v-if="task.hardDeadline">Deadline = {{moment(task.hardDeadline).format('LLL')}}</div>
	<div v-if="task.afterTask">After Tasks =
		<div v-for="task in afterTasks">
			{{task}}
		</div>
	</div>
	<div v-if="task.tags">Tags = 
		<span v-for="tag in task.tags">{{tag}}<span v-if="tag != task.tags[task.tags.length - 1]">, </span></span>
	</div>
	</div>
</template>

<style scoped>
	.container {
		border-width: 1px;
		border-style: solid;
	}
</style>
