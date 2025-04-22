import { useEffect } from "react";

export const useLostFocus = (parentElementRef: React.RefObject<HTMLElement | null>, triggerCondition: boolean, callbackFn: (...args: any) => any) => {
    const handleClickOutside = (event: MouseEvent) => {
        if (parentElementRef.current && !parentElementRef.current.contains(event.target as Node)) {
            callbackFn();
        }
    };

    useEffect(() => {
        if (triggerCondition) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [triggerCondition]);
}