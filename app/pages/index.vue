<script setup>
const router = useRouter();
onMounted(() => {
  router.replace('/dashboard');
  DatabaseInit();
});
</script>
<template>
</template>
