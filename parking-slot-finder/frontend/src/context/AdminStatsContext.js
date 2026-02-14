import { createContext, useContext, useState } from "react";

const AdminStatsContext = createContext();

export const AdminStatsProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <AdminStatsContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </AdminStatsContext.Provider>
  );
};

export const useAdminStats = () => useContext(AdminStatsContext);
