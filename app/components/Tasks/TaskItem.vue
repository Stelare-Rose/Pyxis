<script setup lang=ts>
	import moment from 'moment';
	const props = defineProps({
		task: String,
	})
	const object: Item = await ReadFile(props.task); //TODO: Use Task object rather than unessecarily reading files in shorthand view
	console.log(props.task);
	let afterTasks: any;
	if(object.afterTask){
		afterTasks = await Promise.all(object.afterTask.map(x => SearchCache(x)));
	}
</script>

<template>
	<div class="container">
	<div>Type = {{object.type}}</div>
	<div>Name = {{object.name}}</div>
	<div>Status = {{object.status}}</div>
	<div v-if="object.hardDeadline">Deadline = {{moment(object.hardDeadline).format('LLL')}}</div>
	<div v-if="object.softDeadline">Soft Deadline = {{moment(object.softDeadline).format('LLL')}}</div>
	<div v-if="object.afterTask">After Tasks =
		<div v-for="task in afterTasks">
			{{task}}
		</div>
	</div>
	<div v-if="object.tags">Tags = 
		<div v-for="tag in object.tags">
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
