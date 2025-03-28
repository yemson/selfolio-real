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

  // 서브도메인 제거하고 메인 도메인만 추출
  if (currentHost.includes("localhost")) {
    // 로컬호스트인 경우 메인 도메인으로 설정
    window.location.href = "http://localhost:3000/login";
  }

  const mainDomain = currentHost.split(".").slice(-2).join(".");

  // 새 URL 구성 (프로토콜 + 메인 도메인 + /login)
  const protocol = window.location.protocol;
  const loginUrl = `${protocol}//${mainDomain}/login`;

  // 해당 URL로 이동
  window.location.href = loginUrl;
};
</script>
