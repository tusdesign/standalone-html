import { createContext, FC, PropsWithChildren, useCallback, useState } from 'react';

export interface RequestData {
  visitors: Visitor[];
  company: string;
  visitee: string;
  visitee_mobile: string;
  startTime: Date;
  duration: string[];
  plates: string[];
}

const defaultData: RequestData = {
  company: '',
  duration: ['4'],
  plates: [],
  startTime: new Date(),
  visitee: '',
  visitee_mobile: '',
  visitors: [],
};

export const AppointmentContext = createContext<{
  visitData: RequestData;
  update?: (newVal: RequestData) => void;
  reset?: () => void;
}>({
  visitData: defaultData,
});

export const AppointmentProvider: FC<PropsWithChildren> = ({ children }) => {
  const [data, setData] = useState<RequestData>({ ...defaultData });
  const update = useCallback((newVal: RequestData) => {
    setData(newVal);
  }, []);
  const reset = useCallback(() => {
    setData(defaultData);
  }, []);
  return (
    <AppointmentContext.Provider
      value={{
        visitData: data,
        update,
        reset,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};
