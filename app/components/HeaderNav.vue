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

  // 최소 2개 이상의 부분이 있는지 확인 (서브도메인.도메인.확장자)
  if (parts.length >= 2) {
    // 마지막 두 부분만 가져옴 (도메인.확장자)
    const mainDomain = parts.slice(-2).join(".");
    loginUrl = `${protocol}//${mainDomain}/login`;
  } else {
    // 예상치 못한 형식인 경우 현재 도메인 사용
    loginUrl = `${protocol}//${currentHost}/login`;
  }

  // 디버깅을 위한 로그
  console.log("Navigating to:", loginUrl);

  // 해당 URL로 이동
  window.location.href = loginUrl;
};
</script>
