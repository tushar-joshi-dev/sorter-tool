import { useEffect, useRef } from "react"

const useOutsideClick = (callback: () => void) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOut = (event: MouseEvent | TouchEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };

        document.addEventListener('mouseup', handleClickOut);
        document.addEventListener('touchend', handleClickOut);


        return () => {
            document.removeEventListener('mouseup', handleClickOut);
            document.removeEventListener('touchend', handleClickOut);
        };
    }, [callback]);

    return ref;
};

export default useOutsideClick;