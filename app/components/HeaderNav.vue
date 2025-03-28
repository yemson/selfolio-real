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

  // 도메인 추출 로직
  const parts = currentHost.split(".");

  // 로컬호스트 환경 확인
  if (currentHost.includes("localhost")) {
    loginUrl = `${protocol}//localhost:3000/login`;
  } else {
    // "www" 제거하고 도메인 구성
    let mainDomain;

    if (parts[0] === "www") {
      // www.example.com -> example.com
      mainDomain = parts.slice(1).join(".");
    } else if (parts.length > 2) {
      // subdomain.example.com -> example.com
      mainDomain = parts.slice(-2).join(".");
    } else {
      // 이미 메인 도메인인 경우 (example.com)
      mainDomain = currentHost;
    }

    loginUrl = `${protocol}//${mainDomain}/login`;
  }

  // 디버깅을 위한 로그
  console.log("Original host:", currentHost);
  console.log("Navigating to:", loginUrl);

  // 해당 URL로 이동
  window.location.href = loginUrl;
};
</script>
