<script setup lang=ts>
	import moment from 'moment';
	const props = defineProps<{
		task: IndexItem,
	}>()
	console.log(props.task);
	const task = props.task
	let afterTasks: any;
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
		<div v-for="tag in task.tags">
			{{tag}}
		</div>
	</div>
	</div>
</template>

<style scoped>
	.container {
		border-width: 1px;
		border-style: solid;
	}
</style>
