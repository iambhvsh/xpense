import React, { createContext, useCallback, useContext, useState } from 'react';
import { AlertAction, AlertModal } from '../ui/Modal';

interface AlertOptions {
  title?: string;
  message?: string;
  actions?: AlertAction[];
}

interface AlertContextValue {
  showAlert: (options: AlertOptions) => void;
  dismissAlert: () => void;
}

interface AlertState extends AlertOptions {
  actions: AlertAction[];
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alertState, setAlertState] = useState<AlertState | null>(null);
  const [processing, setProcessing] = useState(false);

  const showAlert = useCallback((options: AlertOptions) => {
    // Don't show alert if message is empty/undefined
    if (!options.message && !options.title) {
      return;
    }
    
    setAlertState({
      title: options.title,
      message: options.message || '',
      actions: options.actions && options.actions.length > 0 ? options.actions : [{ label: 'OK' }]
    });
    setProcessing(false);
  }, []);

  const dismissAlert = useCallback(() => {
    if (processing) return;
    setAlertState(null);
  }, [processing]);

  const handleAction = useCallback(
    async (action: AlertAction) => {
      if (processing) return;
      setProcessing(true);
      try {
        await action.onPress?.();
      } catch (error) {
        // Action failed silently
      } finally {
        setProcessing(false);
        setAlertState(null);
      }
    },
    [processing]
  );

  return (
    <AlertContext.Provider value={{ showAlert, dismissAlert }}>
      {children}
      <AlertModal
        open={!!alertState}
        title={alertState?.title}
        message={alertState?.message}
        actions={alertState?.actions || []}
        onAction={handleAction}
        onClose={dismissAlert}
        processing={processing}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context.showAlert;
};

