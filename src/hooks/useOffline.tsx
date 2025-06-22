
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function useOffline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online! Your data will sync automatically.');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.info('You are offline. The app will continue to work with cached data.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline };
}
