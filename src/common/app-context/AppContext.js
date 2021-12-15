import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();
const AppUpdateContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export function useAppContextUpdate() {
  return useContext(AppUpdateContext);
}

export function AppProvider({ children }) {
  const emptyContext = {
    onDetailsPage: undefined
  };

  const [app, setApp] = useState(emptyContext);

  /**
   *
   * @param info should send values to update, other values will be preserved
   */
  function setAppInfo(info) {
    const updated = {
      ...app,
      ...info,
    };
    setApp(updated);
  }

  return (
    <AppContext.Provider value={app}>
      <AppUpdateContext.Provider value={setAppInfo}>
        {children}
      </AppUpdateContext.Provider>
    </AppContext.Provider>
  );
}
