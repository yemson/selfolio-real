export function usePortfolio() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const createPortfolio = async ({
    title,
    content,
    is_featured,
  }: {
    title: string;
    content: string;
    is_featured: boolean;
  }) => {
    loading.value = true;
    error.value = null;
    try {
      await $fetch("/api/portfolio", {
        method: "POST",
        body: {
          title,
          content,
          is_featured,
        },
      });
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
      console.error("포트폴리오 생성 실패:", error.value);
    } finally {
      loading.value = false;
    }
  };

  return {
    createPortfolio,
    loading,
    error,
  };
}
