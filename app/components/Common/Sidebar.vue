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
							 hovered == 'kanban' ? color.text.lilac :
							 (route.path == '/dashboard' ? color.pastel.lilac : '#000')"
			  />
		</Icon>
		</NuxtLink>
		<NuxtLink to="/tags">
		<Icon id="tags" :width='24' :height='24' @mouseenter="hovered = $event.target.id" @mouseleave="hovered = ''">
			<Tags 
				:stroke-color="
					hovered == 'tags' ? color.text.lilac : 
					(route.path == '/tags' ? color.pastel.lilac : '#000')"
				/>
		</Icon>
		</NuxtLink>	
		<NuxtLink to="/ideas">
		<Icon id="ideas" :width='24' :height='24' @mouseenter="hovered = $event.target.id" @mouseleave="hovered = ''">
			<SquareExclamation 
				:stroke-color="
					hovered == 'ideas' ? color.text.lilac : 
					(route.path == '/ideas' ? color.pastel.lilac : '#000')"
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
