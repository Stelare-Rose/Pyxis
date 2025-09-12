<script setup lang=ts>

	const props = withDefaults(defineProps<{
		color: string[];
		textColor: string[];
		text: string;
		size?: "small" | "medium" | "large";
		opaque?: boolean
	}>(),{size: 'small'})
	const color = props.color.map((x) => x + "70");
	const backgroundGradient = `linear-gradient(45deg, ${color.join(',')})`;
	const textGradient = `linear-gradient(45deg, ${props.textColor.join(',')})`;
	var fontSize:string, paddingVer:string, paddingHor: string;
	switch (props.size){
		case 'small':
			paddingVer = '0px';
			paddingHor = '8px';
			fontSize = '11pt';
			break;
		case 'medium':
			paddingVer = '2px';
			paddingHor = '12px';
			fontSize = '12pt';
			break;
		case 'large':
			paddingVer = '4px';
			paddingHor = '14px';
			fontSize = '13pt';
			break;

	}
</script>

<template>
	<div :style="{backgroundColor: opaque ? '#FFFCF2' : '#00000000', borderRadius: '8px'}">
	<div :style="{backgroundImage: backgroundGradient}" class=tags-container >
		<span :style="{'backgroundImage': textGradient}" class=text >{{text}}</span>
	</div>
	</div>
</template>

<style scoped>
	.tags-container {
		padding: v-bind(paddingVer) v-bind(paddingHor);
		border-radius: 8px;
		display: inline-block;
		width: auto;
	}
	.text { 
		--webkit-backgrund-clip: text;
		background-clip: text;
		color: transparent;
		font-weight: 500;
		font-style: bold;
		font-size: v-bind(fontSize);
	}
</style>
