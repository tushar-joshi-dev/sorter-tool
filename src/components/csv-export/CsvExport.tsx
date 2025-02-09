import { ArrowDownTrayIcon } from "@heroicons/react/16/solid";
import Papa from "papaparse";

interface CsvExportProps {
    disabled?: boolean;
    setExportData: () => any[];
}

const CsvExport = (props: CsvExportProps) => {
    const handleClick = () => {
        const data = props.setExportData();
        const csv = Papa.unparse(data);

        const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <button disabled={props.disabled} type="button" onClick={handleClick} className="px-5 py-2.5 w-full h-full item-center justify-center rounded text-white text-sm border-none outline-none bg-blue-500 dark:bg-blue-800 hover:enabled:bg-blue-700 hover:enabled:bg-blue-600 hover:enabled:cursor-pointer disabled:opacity-50">
            <p>Download as CSV</p>
            <ArrowDownTrayIcon className="size-6 text-white inline-flex" />
        </button>
    );
};

export default CsvExport;