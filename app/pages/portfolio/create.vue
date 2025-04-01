<template>
  <div class="border-t border-gray-200">
    <div
      class="flex items-center justify-between p-4 bg-white border-b border-gray-200"
    >
      <h1 class="font-bold">포트폴리오 작성</h1>

      <div class="flex items-center gap-2">
        <UButton variant="outline" label="뒤로가기" @click="$router.back()" />
        <UButton
          variant="solid"
          label="저장하기"
          @click="isSaveModalOpen = true"
        />
      </div>
    </div>

    <MarkdownEditor v-model="markdownContent" :loading="loading" />

    <UModal
      v-model:open="isSaveModalOpen"
      :dismissible="false"
      title="포트폴리오를 저장하시겠습니까?"
      description="포트폴리오 저장 정보를 입력해주세요"
    >
      <template #body>
        <div class="flex flex-col gap-6 w-full">
          <div class="space-y-2">
            <p class="text-sm text-gray-500">포트폴리오 제목을 입력하세요.</p>
            <input
              type="text"
              class="border border-gray-300 rounded p-2 w-full"
              placeholder="포트폴리오 제목"
              v-model="portfolioTitle"
            />
          </div>
          <div class="space-y-2">
            <USwitch
              label="대표 포트폴리오로 설정"
              v-model="isDefaultPortfolio"
            />
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            variant="outline"
            label="취소"
            @click="isSaveModalOpen = false"
          />
          <UButton
            variant="solid"
            label="저장하기"
            :loading="loading"
            @click="
              savePortfolio({
                title: portfolioTitle,
                content: markdownContent,
                is_featured: isDefaultPortfolio,
              })
            "
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  layout: "editor",
});

// 마크다운 내용 상태
const markdownContent = ref(`
# 마크다운 에디터

## 기능
- **볼드** 텍스트 (** 또는 __ 사용)
- *이탤릭* 텍스트 (* 또는 _ 사용)
- ~~취소선~~ 텍스트 (~~ 사용)

### 코드 블록
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

#### 인용문
> 인용문은 이렇게 작성합니다.

##### 링크
[링크 예시](https://example.com)
`);

const portfolioTitle = ref("");
const isDefaultPortfolio = ref(false);
const isSaveModalOpen = ref(false);

// 포트폴리오 관리 컴포저블
const { loading, error, createPortfolio } = usePortfolio();

// 포트폴리오 저장 함수
const savePortfolio = async ({
  title,
  content,
  is_featured,
}: {
  title: string;
  content: string;
  is_featured: boolean;
}) => {
  await createPortfolio({
    title,
    content,
    is_featured,
  });

  if (error.value) {
    console.error("포트폴리오 저장 실패:", error.value);
  } else {
    console.log("포트폴리오 저장 성공");
    isSaveModalOpen.value = false;
    portfolioTitle.value = "";
    isDefaultPortfolio.value = false;
  }
};
</script>
