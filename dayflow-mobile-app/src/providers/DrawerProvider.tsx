import React, { createContext, useContext, useState } from "react";
import { Drawer } from "react-native-drawer-layout";
import SidebarLeft from "@screens/home/sections/SidebarLeft";
import { useThemeColors } from "@constants/theme";

type DrawerContextType = {
  openDrawer: () => void;
  closeDrawer: () => void;
  isOpen: boolean;
};

const DrawerContext = createContext<DrawerContextType>({
  openDrawer: () => {},
  closeDrawer: () => {},
  isOpen: false,
});

export const useDrawer = () => useContext(DrawerContext);

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const colors = useThemeColors();

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer, isOpen: open }}>
      <Drawer
        open={open}
        onOpen={openDrawer}
        onClose={closeDrawer}
        drawerType="slide"
        drawerPosition="left"
        drawerStyle={{
          backgroundColor: colors.cardBackground,
          width: "70%",
        }}
        overlayStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        renderDrawerContent={() => <SidebarLeft onClose={closeDrawer} />}
      >
        {children}
      </Drawer>
    </DrawerContext.Provider>
  );
}
