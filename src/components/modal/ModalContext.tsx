"use client";

import { createContext, useContext } from "react";
import type { ModalSize } from "@/components/modal/modal.types";

export type ModalLayer = {
  stackDepth: number;
  parentSize?: ModalSize;
};

const ModalLayerContext = createContext<ModalLayer>({ stackDepth: 0 });

export function useModalLayer() {
  return useContext(ModalLayerContext);
}

export const ModalLayerProvider = ModalLayerContext.Provider;
