import React, { useState, useContext, createContext } from "react";

export const SidebarContext = createContext();

export const useSidebar = () => useContext(SidebarContext);

const SidebarProvider = ({ children }) => {
  const [selectedCurrentElement, setSelectedCurrentElement] = useState("home");
  const [totalCountCategory, setTotalCountCategory] = useState(null);

  const setSelectedElement = (element) => {
    setSelectedCurrentElement(element);
  };

  return (
    <SidebarContext.Provider
      value={{ selectedCurrentElement, setSelectedElement, setSelectedCurrentElement, totalCountCategory, setTotalCountCategory }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarProvider;
