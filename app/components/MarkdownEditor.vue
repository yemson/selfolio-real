<template>
  <div
    class="flex h-[calc(100svh-4rem)] w-screen bg-gray-100 overflow-hidden divide-x"
  >
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
</template>

<script setup>
import { ref } from "vue";

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

// 텍스트에리어의 커서 위치에 스킬 뱃지 텍스트 삽입
// const insertSkillBadge = () => {
//   const textarea = textareaRef.value;
//   if (!textarea) return;

//   // 현재 커서 위치 저장
//   const cursorPos = textarea.selectionStart;

//   // 텍스트 분할
//   const textBefore = markdownContent.value.substring(0, cursorPos);
//   const textAfter = markdownContent.value.substring(cursorPos);

//   // 삽입할 텍스트 (앞뒤 공백 포함)
//   const badgeText = ' :skill-badge{label="vue"} ';

//   // 텍스트 삽입
//   markdownContent.value = textBefore + badgeText + textAfter;

//   // 포커스 유지하고 삽입된 텍스트 뒤에 커서 위치시키기
//   setTimeout(() => {
//     textarea.focus();
//     const newCursorPos = cursorPos + badgeText.length;
//     textarea.setSelectionRange(newCursorPos, newCursorPos);
//   }, 0);
// };
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
