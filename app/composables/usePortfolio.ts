export function usePortfolio() {
  const loading: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);

  /**
   * 포트폴리오 생성
   * @param portfolioData - 포트폴리오 데이터
   * @returns 생성된 포트폴리오 데이터
   */
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
      const { data, error: fetchError } = await useFetch(
        "/api/create-portfolio",
        {
          method: "POST",
          body: {
            title,
            content,
          },
        }
      );

      if (fetchError.value) {
        const errorMessage =
          typeof fetchError.value === "object" && fetchError.value !== null
            ? fetchError.value.message || "포트폴리오 생성에 실패했습니다."
            : String(fetchError.value);
        throw new Error(errorMessage);
      }

      return data.value;
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = String(err);
      }
      return null;
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
