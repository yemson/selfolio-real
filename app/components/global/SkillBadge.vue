<template>
  <span
    class="inline-flex h-5 items-center gap-1 rounded bg-neutral-200/50 px-1.5 text-xs font-medium text-neutral-600 align-middle"
  >
    <img
      :src="`https://skillicons.dev/icons?i=${label.toLowerCase()}`"
      alt="스킬 뱃지"
      width="12"
      height="12"
      class="inline-block"
    >
    <span>{{ props.label }}</span>
  </span>
</template>

<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    default: "",
  },
});
</script>
