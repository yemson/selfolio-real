<template>
  <div class="max-w-md mx-auto p-6">
    <h1 class="text-3xl font-bold mb-2">로그인</h1>
    <p class="text-gray-500 mb-6">아래에 로그인 정보를 입력해주세요.</p>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="이메일" name="email" size="xl">
        <UInput
          v-model="state.email"
          placeholder="이메일 주소 입력"
          class="w-full"
        />
      </UFormField>

      <UFormField label="비밀번호" name="password" size="xl">
        <UInput
          v-model="state.password"
          type="password"
          placeholder="••••••••"
          class="w-full"
        />
      </UFormField>

      <div class="flex items-center justify-between">
        <div>
          <UCheckbox v-model="rememberMe" label="아이디 저장" />
        </div>
        <NuxtLink
          to="/forgot-password"
          class="text-sm text-primary-500 hover:underline"
        >
          비밀번호 찾기
        </NuxtLink>
      </div>

      <div v-if="error" class="p-3 text-sm text-red-500 bg-red-50 rounded-md">
        {{ error }}
      </div>

      <UButton
        type="submit"
        block
        color="primary"
        :loading="loading"
        :disabled="loading"
        size="xl"
      >
        로그인
      </UButton>

      <div class="text-center mt-4 text-sm">
        계정이 없으신가요?
        <NuxtLink to="/register" class="text-primary-500 hover:underline"
          >회원가입</NuxtLink
        >
      </div>
    </UForm>

    <div class="text-center text-xs text-gray-400 mt-8">© Selfolio</div>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

definePageMeta({
  layout: "auth",
});

// 폼 유효성 검사 스키마
const schema = z.object({
  email: z
    .string({
      required_error: "이메일을 입력해주세요.",
    })
    .email("유효한 이메일을 입력해주세요"),
  password: z
    .string({
      required_error: "비밀번호를 입력해주세요.",
    })
    .min(1, "비밀번호를 입력해주세요"),
});

type Schema = z.output<typeof schema>;

// 폼 상태
const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
});

// 토스트 컴포서블
const toast = useToast();

// Supabase 클라이언트
const supabase = useSupabaseClient();

// UI 상태
const rememberMe = ref(false);
const loading = ref(false);
const error = ref("");
const router = useRouter();

// 로그인 폼 제출 핸들러
async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!event.data.email || !event.data.password) return;

  loading.value = true;
  error.value = "";

  try {
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: event.data.email,
      password: event.data.password,
    });

    if (authError) throw authError;

    if (data.user) {
      toast.add({
        title: "로그인 성공",
        description: "환영합니다!",
        color: "success",
      });

      // 성공하면 메인 페이지로 리다이렉트
      router.push("/");
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다.";
    error.value = errorMessage;

    toast.add({
      title: "로그인 실패",
      description: error.value,
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>
