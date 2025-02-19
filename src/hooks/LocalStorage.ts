import { useState } from "react";

/** Local storage keys */
export const CHECKED_DATA_KEY = 'ST_CheckedData';
export const UNCHECKED_DATA_KEY = 'ST_UncheckedData';

const useLocalStorage = <T>(key: string, defaultValue: T): [T, (newValue: T) => void] => {
    const [localValue, setLocalValue] = useState<T>(() => {
        const setDefault = (k: string, v: T): T => {
            localStorage.setItem(k, JSON.stringify(v));
            return v;
        };
        try {
            const value = localStorage.getItem(key);
            if (value) {
                return JSON.parse(value) as T;
            } else {
                return setDefault(key, defaultValue);
            }
        } catch (e) {
            return setDefault(key, defaultValue);
        }
    });

    const setLocalStorageValue = (newValue: T) => {
        localStorage.setItem(key, JSON.stringify(newValue));
        setLocalValue(newValue);
    };

    return [localValue, setLocalStorageValue];
};

export default useLocalStorage;