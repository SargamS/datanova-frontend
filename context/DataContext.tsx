'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext<any>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [sharedData, setSharedData] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('datanova_cache');
    if (saved) setSharedData(JSON.parse(saved));
  }, []);

  const updateData = (newData: any) => {
    setSharedData(newData);
    localStorage.setItem('datanova_cache', JSON.stringify(newData));
  };

  return (
    <DataContext.Provider value={{ sharedData, updateData }}>
      {children}
    </DataContext.Provider>
  );
}
export const useData = () => useContext(DataContext);