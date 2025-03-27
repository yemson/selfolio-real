<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

// 유효성 검사 스키마 정의
// 개복잡하네
const schema = z
  .object({
    email: z.string().email("유효한 이메일 주소를 입력해주세요"),
    password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다"),
    confirmPassword: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다"),
    username: z
      .string()
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
    // auth 테이블에 생성되는거 트리거해서 profiles 테이블에도 생성되게 함, 거기서 username을 넣어줌
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

<template>
  <div class="max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-6">회원가입</h1>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="이메일" name="email">
        <UInput v-model="state.email" placeholder="your@email.com" />
      </UFormField>

      <UFormField label="닉네임 (영문/숫자/언더스코어만 가능)" name="username">
        <UInput v-model="state.username" placeholder="username_123" />
        <template #description>
          <span class="text-xs text-gray-500"
            >영문, 숫자, 언더스코어(_)만 사용 가능합니다. 3-20자 사이로
            입력해주세요.</span
          >
        </template>
      </UFormField>

      <UFormField label="비밀번호" name="password">
        <UInput
          v-model="state.password"
          type="password"
          placeholder="********"
        />
      </UFormField>

      <UFormField label="비밀번호 확인" name="confirmPassword">
        <UInput
          v-model="state.confirmPassword"
          type="password"
          placeholder="********"
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

      <div class="flex justify-between items-center">
        <NuxtLink to="/login" class="text-sm text-blue-500 hover:underline">
          이미 계정이 있으신가요?
        </NuxtLink>

        <UButton type="submit" :loading="loading" :disabled="loading">
          회원가입
        </UButton>
      </div>
    </UForm>
  </div>
</template>
