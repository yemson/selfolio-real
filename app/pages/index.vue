<!-- pages/index.vue -->
<template>
    <div>
        <h1>{{ subdomainData.subdomain }} 서브도메인에 오신 것을 환영합니다</h1>
        <!-- 서브도메인에 따른 조건부 표시 -->
        <div v-if="subdomainData.subdomain === 'main'">
            <p>메인 사이트 콘텐츠</p>
        </div>
        <div v-else-if="data">
            <p>
                {{ subdomainData.subdomain }} 사용자의 프로필 ID:
                {{ data.id }}
            </p>
            <MDC class="prose prose-sm" :value="data.content" tag="article" />
        </div>
        <div v-else>
            <p>{{ subdomainData.subdomain }} 콘텐츠</p>
            <p>해당 사용자의 프로필을 찾을 수 없습니다.</p>
        </div>
    </div>
</template>
<script setup>
const supabase = useSupabaseClient();
// 서버 API에서 서브도메인 정보 가져오기
const { data: subdomainData } = await useFetch("/api/subdomain");
// 프로필 데이터 가져오기
const { data, error } = await useAsyncData(
    `portfolio-${subdomainData.value.subdomain}`,
    async () => {
        try {
            const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("id")
                .eq("username", subdomainData.value.subdomain)
                .single();
            if (profileError) {
                console.error("Supabase 쿼리 오류:", profileError);
                return null;
            }
            console.log("프로필 데이터:", profileData);
            const { data: portfolioData, error: portfolioError } =
                await supabase
                    .from("portfolios")
                    .select("*")
                    .eq("user_id", profileData.id)
                    .single();
            if (portfolioError) {
                console.error("포트폴리오 데이터를 찾을 수 없습니다.");
                return profileData; // 최소한 프로필 데이터 반환
            }
            console.log("포트폴리오 데이터:", portfolioData);
            return portfolioData; // 포트폴리오 데이터 반환
        } catch (err) {
            console.error("프로필 데이터 가져오기 오류:", err);
            return null;
        }
    },
);
// 에러 처리
if (error.value) {
    console.error("useAsyncData 오류:", error.value);
}

// 페이지 제목 설정
useHead({
    title: `${subdomainData.value.subdomain} - My Site`,
});
</script>
