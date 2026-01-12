<script setup lang=ts>
const props = defineProps<{
  fillColor?: string
  strokeColor?: string
}>()
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    :fill="fillColor ? fillColor : 'none'"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 4L7 20M17 4L14 20M5 8H20M4 16H19"
      :stroke="strokeColor ?? '#000000'"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
</template>
