<script setup lang=ts>
import { info } from '@tauri-apps/plugin-log';

	CheckDataDirectory("Pyxis", true)
	CheckDataDirectory("Pyxis/Items", true)
	CheckDataDirectory("Pyxis/Repeatables", true)
	CheckCacheDirectory("", true)
</script>
<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<style>
	:root {
		--ms-bg: #FFFCF2;
		--ms-ring-color: #DBB4D340;
		--ms-dropdown-bg: #FCF7E6;
		--ms-option-line-height: auto;
		--ms-dropdown-border-color: #F7F3E6;
		--ms-dropdown-border-width: 3px;
		--ms-dropdown-radius: 16px;
		--ms-ring-width: 3px;
		--ms-option-bg-selected: #F7F3E6;
		--ms-option-bg-pointed: #EDB7CA20;
		--ms-option-bg-selected-pointed: #EDB7CA20;
		--foam: #FFFCF2;
		--cream: #FCF7E6;
		--base: #F7F3E6;
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
