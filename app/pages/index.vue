<template>
  <div v-if="portfolioData">
    <!-- 서브도메인에 따른 조건부 표시 -->
    <div v-if="portfolioData.subdomain === 'main'">
      <p>메인 사이트 콘텐츠</p>
    </div>
    <div
      v-else-if="
        portfolioData.portfolio && 'content' in portfolioData.portfolio
      "
      class="slide-enter"
    >
      <MDC
        class="prose prose-neutral max-w-none"
        :value="portfolioData.portfolio.content"
      />
    </div>
    <div
      v-else-if="portfolioData.profile"
      class="flex justify-center items-center h-[calc(100vh-8rem)]"
    >
      <p>해당 사용자의 포트폴리오를 찾을 수 없습니다.</p>
    </div>
    <div v-else class="flex justify-center items-center h-[calc(100vh-8rem)]">
      <p>해당 사용자의 프로필을 찾을 수 없습니다.</p>
    </div>
  </div>
  <div v-else>
    <p>데이터 로딩 중...</p>
  </div>
</template>

<script setup lang="ts">
import type { MainPortfolioApiResponse } from "@/types/api";

definePageMeta({
  layout: "main",
});

const { data: portfolioData } = await useFetch<MainPortfolioApiResponse>(
  "/api/main-portfolio",
  {
    default: () => ({
      subdomain: "main",
      profile: null,
      portfolio: null,
      error: null,
    }),
  }
);

// 페이지 제목 설정
useHead({
  title:
    portfolioData.value?.subdomain !== "main"
      ? `${portfolioData.value.subdomain} - Selfolio`
      : "Selfolio",
});
</script>

<style scoped>
@keyframes slide-enter {
  0% {
    transform: translateY(10px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .slide-enter,
  .slide-enter-content > * {
    --enter-stage: 0;
    --enter-step: 60ms;
    --enter-initial: 0ms;
    animation: slide-enter 1s both 1;
    animation-delay: calc(
      var(--enter-initial) + var(--enter-stage) * var(--enter-step)
    );
  }

  .slide-enter-content > *:nth-child(1) {
    --enter-stage: 1 !important;
  }
  .slide-enter-content > *:nth-child(2) {
    --enter-stage: 2 !important;
  }
  .slide-enter-content > *:nth-child(3) {
    --enter-stage: 3 !important;
  }
  .slide-enter-content > *:nth-child(4) {
    --enter-stage: 4 !important;
  }
  .slide-enter-content > *:nth-child(5) {
    --enter-stage: 5 !important;
  }
  .slide-enter-content > *:nth-child(6) {
    --enter-stage: 6 !important;
  }
  .slide-enter-content > *:nth-child(7) {
    --enter-stage: 7 !important;
  }
  .slide-enter-content > *:nth-child(8) {
    --enter-stage: 8 !important;
  }
  .slide-enter-content > *:nth-child(9) {
    --enter-stage: 9 !important;
  }
  .slide-enter-content > *:nth-child(10) {
    --enter-stage: 10 !important;
  }
  .slide-enter-content > *:nth-child(11) {
    --enter-stage: 11 !important;
  }
  .slide-enter-content > *:nth-child(12) {
    --enter-stage: 12 !important;
  }
  .slide-enter-content > *:nth-child(13) {
    --enter-stage: 13 !important;
  }
  .slide-enter-content > *:nth-child(14) {
    --enter-stage: 14 !important;
  }
  .slide-enter-content > *:nth-child(15) {
    --enter-stage: 15 !important;
  }
  .slide-enter-content > *:nth-child(16) {
    --enter-stage: 16 !important;
  }
  .slide-enter-content > *:nth-child(17) {
    --enter-stage: 17 !important;
  }
  .slide-enter-content > *:nth-child(18) {
    --enter-stage: 18 !important;
  }
  .slide-enter-content > *:nth-child(19) {
    --enter-stage: 19 !important;
  }
  .slide-enter-content > *:nth-child(20) {
    --enter-stage: 20 !important;
  }
}
</style>
