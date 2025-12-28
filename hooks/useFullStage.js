'use client';

import { MyContexts } from "@/shared/stage/Providers";
import { useContext } from "react";
export const useFullStage = () => {
    return useContext(MyContexts);
};
