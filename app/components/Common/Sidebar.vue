<script setup lang=ts>
	const route = useRoute()
	const color = useColors();
	const hovered = ref('');
	console.log(route.path);
	console.log(hovered);
</script>
<template>
	<section class="icon-container">
		<NuxtLink to="/dashboard">
		<Icon id="kanban" :width='24' :height='24'class="icon" @mouseenter="hovered = $event.target.id" @mouseleave="hovered = ''">
		<Kanban 
			  :stroke-color="
							 hovered == 'kanban' ? color.text.strawberry :
							 (route.path == '/dashboard' ? color.pastel.strawberry : '#000')"
			  />
		</Icon>
		</NuxtLink>
		<NuxtLink to="/tags">
		<Icon id="tags" :width='24' :height='24' @mouseenter="hovered = $event.target.id" @mouseleave="hovered = ''">
			<Tags 
				:stroke-color="
					hovered == 'tags' ? color.text.orange : 
					(route.path == '/tags' ? color.pastel.orange : '#000')"
				/>
		</Icon>
		</NuxtLink>
	</section>
</template>
<style scoped>
	.icon-container { 
		flex-direction: column;
		display: flex;
		width: 100%;
		align-items: center;
		gap: 8px;
	}
</style>
