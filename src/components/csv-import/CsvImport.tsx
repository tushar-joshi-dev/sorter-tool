import { useEffect, useRef, useState } from "react";
import Papa from "papaparse";
import { toast, ToastType } from "../toast/ToastProvider";

interface CsvImportProps {
    hidden?: boolean;
    disabled?: boolean;
    onData?: (data: any[]) => void;
    onError?: (message: string) => void;
}

const CsvImport = (props: CsvImportProps) => {
    const inputFileRef = useRef(null);
    const [disabled, setDisabled] = useState<boolean>(props.disabled ?? false);
    const [statusText, setStatusText] = useState<string>(props.disabled ? 'Disabled' : 'Ready');

    useEffect(() => {
        if (props.disabled) {
            setDisabled(true);
            setStatusText('Disabled');
        }
    }, [props.disabled]);

    const handleError = (message: string) => {
        toast(message, ToastType.ERROR);
        if (props.onError) {
            props.onError(message);
        }
    };

    const handleFileUpload = (event: any) => {
        setDisabled(true);
        if (event?.target?.files?.length > 0) {
            const file: File = event.target.files[0];
            if (file.type !== 'text/csv') {
                handleError('Invalid file type');
            } else {
                setStatusText(`Parsing ${file.name}`);
                Papa.parse(file, {
                    header: true,
                    dynamicTyping: true,
                    comments: '#',
                    complete: (results) => {
                        const data: any[] = results.data;
                        if (data.length == 0) {
                            handleError('Empty CSV loaded');
                        }
                        if (props.onData) {
                            props.onData(data);
                        }
                    },
                    error: (err: Error) => {
                        handleError(err.message);
                    }
                });
            }
        }
        if (inputFileRef.current) {
            (inputFileRef.current as any).value = null;
        }
        setDisabled(props.disabled ?? false);
        setStatusText(props.disabled ? 'Disabled' : 'Ready');
    };

    return props.hidden ? (<></>) : (

        <div className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border-2 border-dashed border-gray-400 p-3 text-gray-600 dark:text-gray-200">
            <label htmlFor="upload-file" className={disabled ? "opacity-50" : "hover:cursor-pointer"}>
                <p className="text-center"><span className="font-bold">Drag & drop</span> or <span className="font-bold">Choose</span> file to upload</p>
                <p className="text-center">Status: {statusText}</p>
            </label>
            <input type="file" ref={inputFileRef} accept=".csv" id="upload-file" disabled={disabled} className="hidden" onChange={handleFileUpload} />
        </div>
    );
};

export default CsvImport;