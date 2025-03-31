export function usePortfolio() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const createPortfolio = async ({
    title,
    content,
  }: {
    title: string;
    content: string;
  }) => {
    loading.value = true;
    error.value = null;
    try {
      const { error: fetchError } = await useFetch("/api/portfolio", {
        method: "POST",
        body: {
          title,
          content,
        },
      });

      if (fetchError.value) {
        error.value = fetchError.value.message;
        throw new Error(`포트폴리오 생성 실패: ${fetchError.value.message}`);
      }
    } catch (err) {
      throw err instanceof Error ? err.message : String(err);
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
