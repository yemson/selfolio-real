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
          @click="$router.push('/portfolio/create')"
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
  const hostname = window.location.hostname;
  const hostnameParts = hostname.split(".");
  const isLocalhost =
    hostname.includes("localhost") || hostname.includes("127.0.0.1");

  // 로컬호스트 환경에서의 서브도메인 확인
  if (isLocalhost) {
    // 예: test.localhost, dev.localhost인 경우
    if (hostnameParts.length > 1 && hostnameParts[0] !== "localhost") {
      // 로컬호스트에 서브도메인이 있는 경우, 루트 로컬호스트로 이동
      window.location.href = `http://localhost:${window.location.port}/`;
    } else {
      // 일반 로컬호스트인 경우 로그인 페이지로 이동
      window.location.href = "/login";
    }
    return;
  }

  // 프로덕션 환경에서의 서브도메인 확인
  const isSubdomain = hostnameParts.length > 2;

  if (isSubdomain) {
    // 서브도메인이 있는 경우, 메인 도메인의 루트로 리다이렉트
    const mainDomain = hostnameParts.slice(-2).join(".");
    window.location.href = `https://${mainDomain}/`;
  } else {
    // 서브도메인이 없는 경우 (domain.com 형태), /login으로 리다이렉트
    window.location.href = "/login";
  }
};
</script>
