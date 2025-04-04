<template>
  <div
    class="flex flex-col h-[calc(100dvh-66px)] w-full bg-gray-100 overflow-hidden divide-x divide-gray-200 relative"
  >
    <!-- 기존 마크다운 에디터 UI -->
    <div class="flex flex-1 w-full overflow-hidden divide-x divide-gray-200">
      <div class="flex-none p-2 bg-gray-50">
        <UNavigationMenu
          orientation="vertical"
          :items="blockItems"
          class="data-[orientation=vertical]:w-48"
        />
      </div>
      <div class="flex flex-col flex-1 h-full">
        <!-- 미리보기 모드 선택 -->
        <div
          class="border-b border-gray-200 p-2 bg-gray-50 flex justify-end items-center"
        >
          <div class="space-x-1">
            <UButton
              :variant="previewMode === 'split' ? 'solid' : 'ghost'"
              icon="i-lucide-columns"
              size="sm"
              title="분할 보기"
              @click="previewMode = 'split'"
            />
            <UButton
              :variant="previewMode === 'edit' ? 'solid' : 'ghost'"
              icon="i-lucide-edit"
              size="sm"
              title="편집 전용"
              @click="previewMode = 'edit'"
            />
            <UButton
              :variant="previewMode === 'preview' ? 'solid' : 'ghost'"
              icon="i-lucide-eye"
              size="sm"
              title="미리보기 전용"
              @click="previewMode = 'preview'"
            />
          </div>
        </div>

        <!-- 나머지 에디터 UI는 동일 -->
        <!-- Content area -->
        <div class="flex flex-1 overflow-hidden">
          <!-- 마크다운 편집 영역 -->
          <div
            v-if="previewMode === 'split' || previewMode === 'edit'"
            :class="{
              'w-1/2': previewMode === 'split',
              'w-full': previewMode === 'edit',
            }"
            class="flex flex-col bg-white overflow-hidden"
          >
            <!-- 인라인 스타일 툴바 -->
            <div
              class="border-b border-gray-200 p-2 bg-gray-50 flex items-center gap-1"
            >
              <UButton
                v-for="item in inlineItems"
                :key="item.label"
                :icon="item.icon"
                :title="item.label"
                color="primary"
                variant="ghost"
                size="sm"
                @click="item.onSelect()"
              />
            </div>

            <!-- 텍스트 에디터 -->
            <textarea
              ref="textareaRef"
              v-model="content"
              class="font-mono w-full flex-1 p-4 resize-none outline-none border-none overflow-auto"
              placeholder="내용을 입력하세요..."
            />
          </div>

          <!-- 마크다운 미리보기 영역 -->
          <div
            v-if="previewMode === 'split' || previewMode === 'preview'"
            :class="{
              'w-1/2': previewMode === 'split',
              'w-full': previewMode === 'preview',
            }"
            class="overflow-auto bg-white border-l border-gray-200"
          >
            <div class="prose max-w-[768px] mx-auto p-4 mt-4">
              <MDC :value="content" tag="article" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

// Props로 받아오는 내용
const props = defineProps({
  modelValue: {
    type: String,
    default: `
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
`,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

// 이벤트 정의
const emit = defineEmits(["update:modelValue", "save-click"]);

// 내부적으로 사용할 컨텐츠 참조 변수
const content = ref(props.modelValue);

// 모델값이 바뀌면 내부 컨텐츠도 업데이트
watch(
  () => props.modelValue,
  (newValue) => {
    content.value = newValue;
  }
);

// 내부 컨텐츠가 바뀌면 부모 컴포넌트에 알림
watch(
  () => content.value,
  (newValue) => {
    emit("update:modelValue", newValue);
  }
);

// 미리보기 모드 설정 (split: 분할, edit: 편집만, preview: 미리보기만)
const previewMode = ref<"split" | "edit" | "preview">("split");

const textareaRef = ref<HTMLTextAreaElement | null>(null);

// 인라인 스타일 항목 타입 정의
interface InlineItem {
  label: string;
  icon: string;
  onSelect: () => void;
}

// 인라인 스타일 항목
const inlineItems: InlineItem[] = [
  {
    label: "볼드",
    icon: "i-lucide-bold",
    onSelect: () => {
      insertStyleAtCursor("**", "**", "볼드 텍스트");
    },
  },
  {
    label: "이탤릭",
    icon: "i-lucide-italic",
    onSelect: () => {
      insertStyleAtCursor("*", "*", "이탤릭 텍스트");
    },
  },
  {
    label: "취소선",
    icon: "i-lucide-strikethrough",
    onSelect: () => {
      insertStyleAtCursor("~~", "~~", "취소선 텍스트");
    },
  },
  {
    label: "인라인 코드",
    icon: "i-lucide-code",
    onSelect: () => {
      insertStyleAtCursor("`", "`", "코드");
    },
  },
  {
    label: "링크",
    icon: "i-lucide-link",
    onSelect: () => {
      insertStyleAtCursor("[", "](https://example.com)", "링크 텍스트");
    },
  },
];

// 블록 스타일 항목
const blockItems = ref<NavigationMenuItem[][]>([
  [
    {
      label: "마크다운",
      icon: "i-lucide-file-text",
      defaultOpen: true,
      children: [
        {
          label: "H1",
          icon: "i-lucide-heading-1",
          onSelect: () => {
            insertAtCursor("\n# ", "\n", "제목 1");
          },
        },
        {
          label: "H2",
          icon: "i-lucide-heading-2",
          onSelect: () => {
            insertAtCursor("\n## ", "\n", "제목 2");
          },
        },
        {
          label: "H3",
          icon: "i-lucide-heading-3",
          onSelect: () => {
            insertAtCursor("\n### ", "\n", "제목 3");
          },
        },
        {
          label: "H4",
          icon: "i-lucide-heading-4",
          onSelect: () => {
            insertAtCursor("\n#### ", "\n", "제목 4");
          },
        },
        {
          label: "H5",
          icon: "i-lucide-heading-5",
          onSelect: () => {
            insertAtCursor("\n##### ", "\n", "제목 5");
          },
        },
        {
          label: "H6",
          icon: "i-lucide-heading-6",
          onSelect: () => {
            insertAtCursor("\n###### ", "\n", "제목 6");
          },
        },
        {
          label: "인용문",
          icon: "i-lucide-quote",
          onSelect: () => {
            insertAtCursor("\n> ", "\n", "인용문");
          },
        },
        {
          label: "코드 블록",
          icon: "i-lucide-code-2",
          onSelect: () => {
            insertAtCursor("\n```javascript\n", "\n```\n", "// 코드 블록");
          },
        },
        {
          label: "이미지",
          icon: "i-lucide-image",
          onSelect: () => {
            insertAtCursor(
              "\n![",
              "](https://example.com/image.jpg)\n",
              "이미지 설명"
            );
          },
        },
        {
          label: "목록",
          icon: "i-lucide-list",
          onSelect: () => {
            insertAtCursor("\n- ", "\n- \n", "목록 항목 1");
          },
        },
        {
          label: "체크박스",
          icon: "i-lucide-check-square",
          onSelect: () => {
            insertAtCursor("\n- [ ] ", "\n- [x] \n", "체크박스 항목 1");
          },
        },
        {
          label: "수평선",
          icon: "i-lucide-minus",
          onSelect: () => {
            insertAtCursor("\n---\n", "", "");
          },
        },
        {
          label: "테이블",
          icon: "i-lucide-table",
          onSelect: () => {
            insertAtCursor(
              "\n| 헤더1 | 헤더2 |\n|-------|-------|\n| ",
              " | 데이터2 |\n",
              "데이터1"
            );
          },
        },
      ],
    },
    {
      label: "컴포넌트",
      icon: "i-lucide-box",
      defaultOpen: true,
      children: [
        {
          label: "스킬 뱃지",
          icon: "i-lucide-file-text",
          onSelect: () => {
            insertStyleAtCursor("", ":skill-badge{label=Vue} ", "");
          },
        },
      ],
    },
  ],
]);

// 인라인 스타일 삽입 함수 (텍스트가 선택된 경우와 선택되지 않은 경우 모두 처리)
const insertStyleAtCursor = (
  prefix: string,
  suffix: string,
  placeholder: string
) => {
  const textarea = textareaRef.value;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = content.value;

  let newText: string;
  let newCursorPos: number;

  if (start === end) {
    // 선택된 텍스트가 없으면 placeholder 삽입
    newText =
      text.substring(0, start) +
      prefix +
      placeholder +
      suffix +
      text.substring(end);
    newCursorPos = start + prefix.length + placeholder.length + suffix.length;

    // 커서 위치 업데이트 (선택 없이 커서만 이동)
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  } else {
    // 선택된 텍스트가 있으면 해당 텍스트에 스타일 적용
    newText =
      text.substring(0, start) +
      prefix +
      text.substring(start, end) +
      suffix +
      text.substring(end);

    // 커서 위치 업데이트 (선택 없이 커서만 끝 부분으로 이동)
    const newPosition = start + prefix.length + (end - start) + suffix.length;
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  }

  content.value = newText;
};

// 블록 스타일 삽입 함수
const insertAtCursor = (
  prefix: string,
  suffix: string,
  placeholder: string
) => {
  const textarea = textareaRef.value;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = content.value;

  let newText: string;
  let newCursorPos: number;

  if (start === end) {
    // 선택된 텍스트가 없으면 placeholder 삽입
    newText =
      text.substring(0, start) +
      prefix +
      placeholder +
      suffix +
      text.substring(end);
    newCursorPos = start + prefix.length + placeholder.length + suffix.length;

    // 커서 위치 업데이트 (선택 없이 커서만 이동)
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  } else {
    // 선택된 텍스트가 있으면 해당 텍스트에 스타일 적용
    newText =
      text.substring(0, start) +
      prefix +
      text.substring(start, end) +
      suffix +
      text.substring(end);

    // 커서 위치 업데이트 (선택 없이 커서만 끝 부분으로 이동)
    const newPosition = start + prefix.length + (end - start) + suffix.length;
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  }

  content.value = newText;
};
</script>

<style scoped>
textarea {
  width: 100%;
  display: block;
}
</style>
