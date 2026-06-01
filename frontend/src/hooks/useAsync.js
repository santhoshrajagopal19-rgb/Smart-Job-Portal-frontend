import { useState, useCallback } from 'react';

// Custom hook for handling loading and errors in async operations
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);
    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(err);
      setStatus('error');
      throw err;
    }
  }, [asyncFunction]);

  // Execute immediately if requested
  if (immediate) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useState(() => {
      execute();
    });
  }

  return { status, data, error, execute };
};
