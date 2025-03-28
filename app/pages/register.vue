<template>
  <div class="max-w-md mx-auto p-6">
    <h1 class="text-3xl font-bold mb-2">회원가입</h1>
    <p class="text-gray-500 mb-6">아래에 회원가입 정보를 입력해주세요.</p>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="이메일" name="email" size="xl">
        <UInput
          v-model="state.email"
          placeholder="이메일 주소 입력"
          class="w-full"
        />
      </UFormField>

      <UFormField label="닉네임" name="username" size="xl">
        <UInput
          v-model="state.username"
          placeholder="닉네임 입력"
          class="w-full"
        />
        <template #description>
          <span class="text-xs text-gray-500">
            영문, 숫자, 언더스코어(_)만 사용 가능합니다. 3-20자 사이로
            입력해주세요.
          </span>
        </template>
      </UFormField>

      <UFormField label="비밀번호" name="password" size="xl">
        <UInput
          v-model="state.password"
          type="password"
          placeholder="••••••••"
          class="w-full"
        />
      </UFormField>

      <UFormField label="비밀번호 확인" name="confirmPassword" size="xl">
        <UInput
          v-model="state.confirmPassword"
          type="password"
          placeholder="••••••••"
          class="w-full"
        />
      </UFormField>

      <UFormField name="terms">
        <UCheckbox
          v-model="state.terms"
          label="이용약관 및 개인정보처리방침에 동의합니다"
        />
      </UFormField>

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
        회원가입
      </UButton>

      <div class="text-center mt-4 text-sm">
        이미 계정이 있으신가요?
        <NuxtLink to="/login" class="text-primary-500 hover:underline">
          로그인
        </NuxtLink>
      </div>
    </UForm>

    <div class="text-center text-xs text-gray-400 mt-8">© Selfolio</div>
  </div>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

definePageMeta({
  layout: "auth",
});

// 유효성 검사 스키마 정의
const schema = z
  .object({
    email: z
      .string({
        required_error: "이메일을 입력해주세요.",
      })
      .email("유효한 이메일 주소를 입력해주세요"),
    password: z
      .string({
        required_error: "비밀번호를 입력해주세요.",
      })
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다"),
    confirmPassword: z
      .string({
        required_error: "비밀번호 확인을 입력해주세요.",
      })
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다"),
    username: z
      .string({
        required_error: "닉네임을 입력해주세요.",
      })
      .min(3, "닉네임은 최소 3자 이상이어야 합니다")
      .max(20, "닉네임은 최대 20자까지 가능합니다")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "닉네임은 영문, 숫자, 언더스코어(_)만 사용 가능합니다"
      ),
    terms: z.boolean().refine((val) => val === true, {
      message: "이용약관에 동의해주세요",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

type Schema = z.output<typeof schema>;

// 회원가입 폼 상태
const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
  confirmPassword: undefined,
  username: undefined,
  terms: false,
});

const supabase = useSupabaseClient();
const router = useRouter();
const toast = useToast();
const loading = ref(false);
const error = ref("");

// 회원가입 폼 제출 핸들러
async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!event.data.email || !event.data.password) return;

  loading.value = true;
  error.value = "";

  try {
    // 닉네임이 www인지 확인
    if (event.data.username === "www") {
      throw new Error("닉네임으로 'www'는 사용할 수 없습니다.");
    }

    // Supabase 회원가입 처리
    // 먼저 닉네임 중복 확인
    const { data: existingUsers, error: usernameCheckError } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", event.data.username)
      .limit(1);

    if (usernameCheckError) throw usernameCheckError;

    if (existingUsers && existingUsers.length > 0) {
      throw new Error(
        "이미 사용 중인 닉네임입니다. 다른 닉네임을 선택해주세요."
      );
    }

    // 회원가입 진행
    const { data, error: authError } = await supabase.auth.signUp({
      email: event.data.email,
      password: event.data.password,
      options: {
        data: {
          username: event.data.username,
        },
      },
    });

    if (authError) throw authError;

    if (data.user) {
      toast.add({
        title: "회원가입 성공",
        description:
          "인증 이메일을 발송했습니다. 이메일함을 확인하여 인증을 완료해주세요.",
        color: "success",
        duration: 6000,
      });
      router.push("/");
    }
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "회원가입 중 오류가 발생했습니다.";
    error.value = errorMessage;

    toast.add({
      title: "회원가입 실패",
      description: error.value,
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>
