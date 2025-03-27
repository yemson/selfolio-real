<template>
  <div v-if="portfolioData">
    <h1>{{ portfolioData.subdomain }} 서브도메인에 오신 것을 환영합니다</h1>

    <!-- 서브도메인에 따른 조건부 표시 -->
    <div v-if="portfolioData.subdomain === 'main'">
      <p>메인 사이트 콘텐츠</p>
    </div>
    <div
      v-else-if="
        portfolioData.portfolio && 'content' in portfolioData.portfolio
      "
    >
      <p>
        {{ portfolioData.subdomain }} 사용자의 프로필 ID:
        {{ portfolioData.portfolio.user_id }}
      </p>
      <MDC
        class="prose prose-sm"
        :value="portfolioData.portfolio.content"
        tag="article"
      />
    </div>
    <div v-else-if="portfolioData.profile">
      <p>
        {{ portfolioData.subdomain }} 사용자의 프로필 ID:
        {{ portfolioData.profile.id }}
      </p>
      <p>해당 사용자의 포트폴리오를 찾을 수 없습니다.</p>
    </div>
    <div v-else>
      <p>{{ portfolioData.subdomain }} 콘텐츠</p>
      <p>해당 사용자의 프로필을 찾을 수 없습니다.</p>
      <p v-if="portfolioData.error" class="text-red-500">
        {{ portfolioData.error }}
      </p>
    </div>
  </div>
  <div v-else>
    <p>데이터 로딩 중...</p>
  </div>
</template>

<script setup lang="ts">
import type { PortfolioApiResponse } from "@/types/api";

const { data: portfolioData } = await useFetch<PortfolioApiResponse>(
  "/api/portfolio",
  {
    default: () => ({
      subdomain: "default",
      profile: null,
      portfolio: null,
      error: null,
    }),
  }
);

// 페이지 제목 설정
useHead({
  title: `${portfolioData.value?.subdomain || "Default"} - My Site`,
});
</script>
