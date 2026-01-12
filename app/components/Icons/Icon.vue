<script setup lang=ts>
interface Props {
  width?: number
  height?: number
};

const props = withDefaults(defineProps<Props>(), {
  width: 12,
  height: 12,
})
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="props.width"
    :height="props.height"
    role="presentation"
  >
    <slot />
  </svg>
</template>
