<template>
  <div class="flex justify-between items-center h-8">
    <div class="cursor-pointer" @click="$router.push('/')">Selfolio</div>
    <div class="flex gap-2">
      <UButton
        v-if="start && !user"
        trailing-icon="i-lucide-arrow-right"
        size="md"
        @click="navigateToLogin"
        >시작하기</UButton
      >
      <template v-else-if="user">
        <UButton leading-icon="i-lucide-folder-open" variant="outline"
          >내 포트폴리오</UButton
        >
        <UButton
          leading-icon="i-lucide-plus"
          size="md"
          @click="$router.push('/create')"
          >새 포트폴리오</UButton
        >
        <UButton
          variant="ghost"
          leading-icon="i-lucide-log-out"
          size="md"
          @click="logout"
        >
          로그아웃</UButton
        >
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  start: {
    type: Boolean,
    default: false,
  },
});

const user = useSupabaseUser();

const logout = async () => {
  const { error } = await useSupabaseClient().auth.signOut();
  if (error) {
    console.error("로그아웃 실패:", error);
  } else {
    console.log("로그아웃 성공");
    window.location.href = "/";
  }
};

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

  history.pushState(null, "", loginUrl);
};
</script>
