<script setup lang=ts>
import { environment } from './stores/environment'

	CheckDataDirectory("Pyxis", true)
	CheckDataDirectory("Pyxis/Items", true)
	CheckDataDirectory("Pyxis/Items/Active", true)
	CheckDataDirectory("Pyxis/Repeatables", true)
	if(environment.env == 'dev'){
		CheckDataDirectory("Pyxis-dev", true)
		CheckDataDirectory("Pyxis-dev/Items", true)
		CheckDataDirectory("Pyxis-dev/Items/Active", true)
		CheckDataDirectory("Pyxis-dev/Repeatables", true)
	}
	CheckCacheDirectory("", true)
</script>
<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<style>
	:root {
		--ms-bg: var(--foam);
		--ms-ring-color: var(--pink);
		--ms-dropdown-bg: var(--cream);
		--ms-option-line-height: auto;
		--ms-dropdown-border-color: #DBB4D3;
		--ms-dropdown-border-width: 1px;
		--ms-dropdown-radius: 16px;
		--ms-ring-width: 1px;
		--ms-max-height: 16rem;
		--ms-option-bg-selected: var(--base);
		--ms-option-bg-disabled: #CF828240;
		--ms-option-bg-pointed: #DBB4D340;
		--ms-option-bg-selected-pointed: #DBB4D340;
		--foam: #F7F1E6;
		--cream: #F0E8DA;
		--base: #E6D9C3;
		--strawberry: #CF8282;
		--orange: #D4A266;
		--lemon: #E3CD7F;
		--leaf: #9CCC96;
		--mint: #99CFAC;
		--sky: #90CDDE;
		--blueberry: #9BB0DE;
		--grape: #9B98D6;
		--plum: #AA99D1;
		--lavender: #CCA3D6;
		--lilac: #DBB4D3;
		--pink: #EDB7CA;
		--milk: #FFFFFF;
		--fog: #c7c7c7;
		--subtext-2: #616161;
		--subtext-1: #4D4D4D;
		--text: #3B3B3B;
		--highlight: #2E2E2E;
	}

	body {
		margin: 0;
		font-family: "Open Sans", sans-serif;
		font-weight: 400;
		font-style: normal;
		background-color: var(--cream);
	}
	.ghost {
		opacity: 0.3;
	}
</style>
