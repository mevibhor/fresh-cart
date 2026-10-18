import { useCallback, useEffect, useState } from "react";

function useApi(apiFunction) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestNumber, setRequestNumber] = useState(0);

  const refetch = useCallback(() => {
    setRequestNumber((number) => number + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiFunction(controller.signal);

        if (!controller.signal.aborted) {
          setData(result);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      controller.abort();
    };
  }, [apiFunction, requestNumber]);

  return { data, isLoading, error, refetch };
}

export default useApi;
