import React, {
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  ReactNode,
} from "react";
import {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { useColorScheme } from "react-native";
import { BottomSheetRef } from "@types";
import { THEME_COLORS } from "@constants/theme";

interface BottomSheetComponentProps {
  children: ReactNode;
  snapPoints?: string[];
  enablePanDownToClose?: boolean;
  enableBackdropClose?: boolean;
  enableDynamicSizing?: boolean;
}

const BottomSheetComponent = forwardRef<
  BottomSheetRef,
  BottomSheetComponentProps
>(
  (
    {
      children,
      snapPoints = ["50%"],
      enablePanDownToClose = true,
      enableBackdropClose = true,
      enableDynamicSizing = true,
    },
    ref
  ) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const colorScheme = useColorScheme();

    const openSheet = useCallback(() => {
      bottomSheetRef.current?.present();
    }, []);

    const closeSheet = useCallback(() => {
      bottomSheetRef.current?.dismiss();
    }, []);

    useImperativeHandle(ref, () => ({
      open: openSheet,
      close: closeSheet,
    }));

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.7}
          enableTouchThrough={false}
          onPress={enableBackdropClose ? closeSheet : undefined}
        />
      ),
      [enableBackdropClose, closeSheet]
    );

    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={enableDynamicSizing ? undefined : snapPoints}
        enableDynamicSizing={enableDynamicSizing}
        enablePanDownToClose={enablePanDownToClose}
        backdropComponent={renderBackdrop}
        handleStyle={{
          borderTopRightRadius: 14,
          borderTopLeftRadius: 14,
          backgroundColor:
            colorScheme === "dark"
              ? THEME_COLORS.dark.card
              : THEME_COLORS.light.card,
        }}
        handleIndicatorStyle={{
          backgroundColor:
            colorScheme === "dark"
              ? THEME_COLORS.dark.border
              : THEME_COLORS.neutral.gray,
          width: 40,
          height: 4,
        }}
        style={{
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 10,
          zIndex: 9999,
        }}
      >
        <BottomSheetView className="flex-1 pb-10 bg-card dark:bg-background-dark">
          {children}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

BottomSheetComponent.displayName = "BottomSheetComponent";

export default BottomSheetComponent;
