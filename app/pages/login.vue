<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

// 유효성 검사 스키마 정의
const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

// 로그인 폼 상태
const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
});

const toast = useToast();
const loading = ref(false);
const error = ref("");
const supabase = useSupabaseClient();
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

<template>
  <div class="max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-6">로그인</h1>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="이메일" name="email">
        <UInput v-model="state.email" placeholder="your@email.com" />
      </UFormField>

      <UFormField label="비밀번호" name="password">
        <UInput
          v-model="state.password"
          type="password"
          placeholder="********"
        />
      </UFormField>

      <div v-if="error" class="p-3 text-sm text-red-500 bg-red-50 rounded-md">
        {{ error }}
      </div>

      <div class="flex justify-between items-center">
        <NuxtLink
          to="/forgot-password"
          class="text-sm text-blue-500 hover:underline"
        >
          비밀번호를 잊으셨나요?
        </NuxtLink>

        <UButton type="submit" :loading="loading" :disabled="loading">
          로그인
        </UButton>
      </div>

      <div class="text-center mt-4 text-sm">
        계정이 없으신가요?
        <NuxtLink to="/register" class="text-blue-500 hover:underline"
          >회원가입</NuxtLink
        >
      </div>
    </UForm>
  </div>
</template>
