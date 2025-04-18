import { RefObject } from "react";
import { ReactSetState } from "../types/react.types";

export function startCodeTimer(timerRef: RefObject<number | null>, setResendTime: ReactSetState<number>) {
    setResendTime(60);
    
    timerRef.current = setInterval(() => {
        setResendTime(prev => {
            if (prev <= 1) {
                clearInterval(timerRef.current || undefined)
                return 0;
            }

            return prev - 1;
        })
    }, 1000)
}