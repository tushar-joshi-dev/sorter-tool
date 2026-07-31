import { useState } from "react";

/** Local storage keys */
export const CHECKED_DATA_KEY = 'ST_CheckedData';
export const UNCHECKED_DATA_KEY = 'ST_UncheckedData';

// Define options config to keep the signature clean
interface LocalStorageOptions {
    // If T is an array, this function runs on every item inside it
    mergeItemDefaults?: (item: any) => any;
}

const useLocalStorage = <T>(key: string, defaultValue: T, options?: LocalStorageOptions): [T, (newValue: T) => void] => {
    const [localValue, setLocalValue] = useState<T>(() => {
        const setDefault = (k: string, v: T): T => {
            localStorage.setItem(k, JSON.stringify(v));
            return v;
        };
        try {
            const value = localStorage.getItem(key);
            if (value) {
                let parsed = JSON.parse(value);
                // If the user provided a merge callback and the data is an array
                if (options?.mergeItemDefaults && Array.isArray(parsed)) {
                    parsed = parsed.map(options.mergeItemDefaults);
                }
                // return JSON.parse(value) as T;
                return parsed as T;
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