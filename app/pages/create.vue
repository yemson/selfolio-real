<template>
  <div class="border-t border-gray-200">
    <div class="flex items-center justify-between p-4 border-b border-gray-200">
      <h1 class="font-semibold">새 포트폴리오</h1>
      <div class="flex items-center space-x-2">
        <UButton leading-icon="i-lucide-eye" size="md" variant="outline">
          미리보기
        </UButton>
        <UButton leading-icon="i-lucide-save" size="md">저장하기</UButton>
      </div>
    </div>
    <MarkdownEditor />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "editor",
});
</script>
