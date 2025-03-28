<template>
  <div class="flex justify-between items-center h-8">
    <div>Selfolio</div>
    <UButton
      v-if="start"
      trailing-icon="i-lucide-arrow-right"
      size="md"
      @click="navigateToLogin"
      >시작하기</UButton
    >
  </div>
</template>

<script setup lang="ts">
defineProps({
  start: {
    type: Boolean,
    default: false,
  },
});

const navigateToLogin = () => {
  // 현재 URL에서 호스트 부분 가져오기
  const currentHost = window.location.host;
  const protocol = window.location.protocol;
  let loginUrl;

  // 로컬호스트 환경인 경우
  if (currentHost.includes("localhost")) {
    loginUrl = `http://localhost:3000/login`;
  } else {
    // 실제 환경인 경우 서브도메인 제거하고 메인 도메인만 추출
    const mainDomain = currentHost.split(".").slice(-2).join(".");
    loginUrl = `${protocol}://${mainDomain}/login`;
  }

  // 해당 URL로 이동
  window.location.href = loginUrl;
};
</script>
