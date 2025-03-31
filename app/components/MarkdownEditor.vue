<template>
  <div
    class="flex h-[calc(100svh-130px)] w-screen bg-gray-100 overflow-hidden divide-x divide-gray-200"
  >
    <div class="flex-1 p-2 bg-gray-50">
      <UNavigationMenu
        orientation="vertical"
        :items="items"
        class="data-[orientation=vertical]:w-48"
      />
    </div>
    <div class="flex w-full h-full divide-x">
      <div
        class="w-1/2 h-full bg-white overflow-auto border-l border-gray-200 flex-1"
      >
        <div class="prose max-w-none p-4">
          <MDC :value="markdownContent" tag="article" />
        </div>
      </div>

      <div class="w-1/2 h-full bg-white flex-1 relative">
        <textarea
          ref="textareaRef"
          v-model="markdownContent"
          class="font-mono w-full h-full p-4 resize-none outline-none border-none"
          placeholder="내용을 입력하세요..."
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { NavigationMenuItem } from "@nuxt/ui";

// 마크다운 내용 저장
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

const textareaRef = ref(null);

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: "마크다운",
      icon: "i-lucide-file-text",
      children: [
        {
          label: "H1",
          icon: "i-lucide-heading-1",
          description: "Define shortcuts for your application.",
          onSelect: () => {
            markdownContent.value += "# H1\n";
          },
        },
      ],
    },
    {
      label: "컴포넌트",
      icon: "i-lucide-box",
      to: "/components",
      active: true,
      defaultOpen: true,
      children: [
        {
          label: "Link",
          icon: "i-lucide-file-text",
          description: "Use NuxtLink with superpowers.",
          to: "/components/link",
        },
        {
          label: "Modal",
          icon: "i-lucide-file-text",
          description: "Display a modal within your application.",
          to: "/components/modal",
        },
      ],
    },
  ],
]);
</script>

<style scoped>
textarea {
  border: none;
  height: 100vh;
  width: 100%;
  display: block;
  overflow: auto;
}
</style>
