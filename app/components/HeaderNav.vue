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

  // 로컬호스트 환경 확인
  if (currentHost.includes("localhost")) {
    loginUrl = `${protocol}//localhost:3000/login`;
  } else {
    // 모든 서브도메인에서 메인 도메인 추출 (www를 특별 취급하지 않음)
    const parts = currentHost.split(".");

    // 서브도메인이 있는 경우 (parts.length > 2) 메인 도메인만 추출
    // example.com -> example.com
    // subdomain.example.com -> example.com (www.example.com 포함)
    const mainDomain =
      parts.length > 2 ? parts.slice(-2).join(".") : currentHost;

    loginUrl = `${protocol}//${mainDomain}/login`;
  }

  // 디버깅을 위한 로그
  console.log("Original host:", currentHost);
  console.log("Navigating to:", loginUrl);

  // 해당 URL로 이동
  window.location.href = loginUrl;
};
</script>
