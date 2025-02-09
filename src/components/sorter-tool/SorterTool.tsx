import { useState } from "react";
import CsvImport from "../csv-import/CsvImport";
import DataEntry from "../../model/DataEntry";
import SortItem from "../sort-item/SortItem";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import CsvExport from "../csv-export/CsvExport";
import { toast, ToastType } from "../toast/ToastProvider";
import EditItem from "../modal/edit-item/EditItem";
import { PlusIcon } from "@heroicons/react/24/solid";
import { v4 as uuidGenerator } from 'uuid';

const SorterTool = () => {
    const [checkedData, setCheckedData] = useState<DataEntry[]>([]);
    const [uncheckedData, setUncheckedData] = useState<DataEntry[]>([]);
    const [displayEdit, setDisplayEdit] = useState<boolean>(false);

    const handleDataImport = (importedData: any[]) => {
        const checkedItems: DataEntry[] = [];
        const uncheckedItems: DataEntry[] = [];
        importedData.forEach(item => {
            // Validate data
            if (item['id'] === undefined || item['text'] === undefined) {
                toast('Invalid data schema', ToastType.ERROR);
                return;
            }
            const dataEntry = item as DataEntry;
            if (dataEntry.checked) {
                checkedItems.push(dataEntry);
            } else {
                uncheckedItems.push(dataEntry);
            }
        });
        setCheckedData(checkedItems);
        setUncheckedData(uncheckedItems);
    };

    const provideExportData = () => {
        return [...uncheckedData, ...checkedData];
        // return [...uncheckedData, ...checkedData].map(item => {
        //     const trimmedItem = item as any;
        //     // Sanitize any internal fields
        //     // TODO: move to cleaner transform
        //     delete trimmedItem['checked'];
        //     return trimmedItem;
        // });
    }

    const handleDrag = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = uncheckedData.findIndex((item) => item.id === active.id);
            const newIndex = uncheckedData.findIndex((item) => item.id === over.id);
            setUncheckedData(arrayMove(uncheckedData, oldIndex, newIndex));
        }
    };

    const markAsComplete = (data: DataEntry) => {
        const itemIndex = uncheckedData.findIndex((item) => item.id === data.id);
        if (itemIndex > -1) {
            setUncheckedData(uncheckedData.toSpliced(itemIndex, 1));
            data.checked = true;
            setCheckedData(checkedData.toSpliced(checkedData.length, 0, data));
        }

    };

    const setAsToDo = (data: DataEntry) => {
        const itemIndex = checkedData.findIndex((item) => item.id === data.id);
        if (itemIndex > -1) {
            setCheckedData(checkedData.toSpliced(itemIndex, 1));
            data.checked = false;
            setUncheckedData(uncheckedData.toSpliced(uncheckedData.length, 0, data));
        }
    };

    const handleUncheckedEdit = (id: string, text: string) => {
        const itemIndex = uncheckedData.findIndex((item) => item.id === id);
        if (itemIndex > -1) {
            const updatedItem = uncheckedData[itemIndex];
            updatedItem.text = text;
            setUncheckedData(uncheckedData.toSpliced(itemIndex, 1, updatedItem));
        }
    };

    const handleUncheckedDelete = (id: string) => {
        const itemIndex = uncheckedData.findIndex((item) => item.id === id);
        if (itemIndex > -1) {
            setUncheckedData(uncheckedData.toSpliced(itemIndex, 1));
        }
    }

    const handleCheckedEdit = (id: string, text: string) => {
        const itemIndex = checkedData.findIndex((item) => item.id === id);
        if (itemIndex > -1) {
            const updatedItem = checkedData[itemIndex];
            updatedItem.text = text;
            setCheckedData(checkedData.toSpliced(itemIndex, 1, updatedItem));
        }
    };

    const handleNewRecord = (text: string) => {
        setDisplayEdit(false);
        const entry: DataEntry = {
            id: uuidGenerator(),
            text,
            checked: false
        };
        setUncheckedData(uncheckedData.toSpliced(uncheckedData.length, 0, entry));
    }

    return (
        <div className='max-w-5xl mx-auto'>
            <div className="w-full grid grid-cols-3 px-10 py-5 gap-10">
                <CsvImport disabled={checkedData.length > 0 || uncheckedData.length > 0} onData={handleDataImport} />
                <CsvExport disabled={checkedData.length < 1 && uncheckedData.length < 1} setExportData={provideExportData} />
                <button type="button" onClick={() => setDisplayEdit(true)} className="px-5 py-2.5 w-full h-full item-center justify-center rounded text-white text-sm border-none outline-none bg-cyan-500 dark:bg-cyan-800 hover:enabled:bg-cyan-700 hover:enabled:cursor-pointer disabled:opacity-50">
                    <p>New entry</p>
                    <PlusIcon className="size-6 inline-flex" />
                </button>
            </div>
            <EditItem show={displayEdit} onCancel={() => setDisplayEdit(false)} onConfirm={handleNewRecord} />
            <hr className="solid text-gray-600 dark:text-gray-400" />
            <h5 className="text-xl text-black dark:text-white font-bold">
                To-Do: {uncheckedData.length}
            </h5>
            <div className="w-full text-black dark:text-white grid gap-2 py-5">
                <DndContext modifiers={[restrictToParentElement]} onDragEnd={handleDrag}>
                    <SortableContext items={uncheckedData} strategy={verticalListSortingStrategy}>
                        {uncheckedData.map(data => {
                            return (<SortItem key={data.id} data={data} toggleCheck={() => markAsComplete(data)} onDelete={() => handleUncheckedDelete(data.id)} onUpdate={(text) => handleUncheckedEdit(data.id, text)} />)
                        })}
                    </SortableContext>
                </DndContext>
            </div>
            <hr className="solid text-gray-600 dark:text-gray-400" />
            <h5 className="text-xl text-black dark:text-white font-bold">
                Completed: {checkedData.length}
            </h5>
            <div className="w-full text-black dark:text-white grid gap-2 py-5">
                {checkedData.map(data => {
                    return (<SortItem key={data.id} data={data} toggleCheck={() => setAsToDo(data)} onDelete={() => { }} onUpdate={(text) => handleCheckedEdit(data.id, text)} />)
                })}
            </div>
        </div>
    );
};

export default SorterTool;