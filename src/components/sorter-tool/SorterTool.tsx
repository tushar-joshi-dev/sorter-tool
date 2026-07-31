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
import { ArrowPathRoundedSquareIcon, PlusIcon } from "@heroicons/react/24/solid";
import { v4 as uuidGenerator } from 'uuid';
import useLocalStorage, { CHECKED_DATA_KEY, UNCHECKED_DATA_KEY } from "../../hooks/LocalStorage";
import DeleteConfirmation from "../modal/delete-confirm/DeleteConfirmation";
import { DEFAULT_GROUP } from "../../constants/ValueConstants";

const SorterTool = () => {
    const mergeDataEntryDefault = (item: Partial<DataEntry>): DataEntry => ({
        group: DEFAULT_GROUP,
        ...item,
    }) as DataEntry;

    const [checkedData, setCheckedData] = useLocalStorage<DataEntry[]>(CHECKED_DATA_KEY, [], {mergeItemDefaults: mergeDataEntryDefault});
    const [uncheckedData, setUncheckedData] = useLocalStorage<DataEntry[]>(UNCHECKED_DATA_KEY, [], {mergeItemDefaults: mergeDataEntryDefault});
    const [displayEdit, setDisplayEdit] = useState<boolean>(false);
    const [displayDeleteConfirm, setDisplayDeleteConfirm] = useState<boolean>(false);

    const sortAndSet = (items: DataEntry[], setData: (newValue: DataEntry[]) => void): void => {
        // sort
        items.sort
        setData(items.toSorted((item1, item2) => {
            if (item1.group < item2.group) return -1;
            if (item1.group > item2.group) return 1;
            return 0; // returns 0 if groups match to keep relative order
        }));
    };

    const handleDataImport = (importedData: any[]) => {
        const checkedItems: DataEntry[] = [];
        const uncheckedItems: DataEntry[] = [];
        importedData.forEach(item => {
            // Validate data
            if (item['id'] === undefined || item['text'] === undefined) {
                toast('Invalid data schema', ToastType.ERROR);
                return;
            }
            const dataEntry = { ...item, notes: item['notes'] ?? '', group: item['group'] ?? DEFAULT_GROUP } as DataEntry;
            if (dataEntry.checked) {
                checkedItems.push(dataEntry);
            } else {
                uncheckedItems.push(dataEntry);
            }
        });
        sortAndSet(checkedItems, setCheckedData);
        sortAndSet(uncheckedItems, setUncheckedData);
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
            sortAndSet(arrayMove(uncheckedData, oldIndex, newIndex), setUncheckedData);
        }
    };

    const markAsComplete = (data: DataEntry) => {
        const itemIndex = uncheckedData.findIndex((item) => item.id === data.id);
        if (itemIndex > -1) {
            setUncheckedData(uncheckedData.toSpliced(itemIndex, 1));
            data.checked = true;
            sortAndSet(checkedData.toSpliced(checkedData.length, 0, data), setCheckedData)
        }
    };

    const setAsToDo = (data: DataEntry) => {
        const itemIndex = checkedData.findIndex((item) => item.id === data.id);
        if (itemIndex > -1) {
            setCheckedData(checkedData.toSpliced(itemIndex, 1));
            data.checked = false;
            sortAndSet(uncheckedData.toSpliced(uncheckedData.length, 0, data), setUncheckedData);
        }
    };

    const handleUncheckedEdit = (id: string, text: string, notes: string, group: string) => {
        const itemIndex = uncheckedData.findIndex((item) => item.id === id);
        if (itemIndex > -1) {
            const updatedItem = uncheckedData[itemIndex];
            updatedItem.text = text;
            updatedItem.notes = notes;
            updatedItem.group = group;
            sortAndSet(uncheckedData.toSpliced(itemIndex, 1, updatedItem), setUncheckedData);
        }
    };

    const handleUncheckedDelete = (id: string) => {
        const itemIndex = uncheckedData.findIndex((item) => item.id === id);
        if (itemIndex > -1) {
            setUncheckedData(uncheckedData.toSpliced(itemIndex, 1));
        }
    }

    const handleCheckedEdit = (id: string, text: string, notes: string, group: string) => {
        const itemIndex = checkedData.findIndex((item) => item.id === id);
        if (itemIndex > -1) {
            const updatedItem = checkedData[itemIndex];
            updatedItem.text = text;
            updatedItem.notes = notes;
            updatedItem.group = group;
            sortAndSet(checkedData.toSpliced(itemIndex, 1, updatedItem), setCheckedData);
        }
    };

    const handleNewRecord = (text: string, notes: string, group: string) => {
        setDisplayEdit(false);
        const entry: DataEntry = {
            id: uuidGenerator(),
            text,
            notes,
            checked: false,
            group: group ?? 'default',
        };
        sortAndSet(uncheckedData.toSpliced(uncheckedData.length, 0, entry), setUncheckedData);
    };

    const handleDeleteConfirmed = () => {
        setDisplayDeleteConfirm(false);
        setCheckedData([]);
        setUncheckedData([]);
    };

    return (
        <div className='max-w-5xl mx-auto'>
            <div className="w-full grid grid-cols-2 px-5 py-5 gap-5">
                <CsvImport disabled={checkedData.length > 0 || uncheckedData.length > 0} onData={handleDataImport} />
                <div className="w-full grid grid-cols-3 gap-5">
                    <CsvExport disabled={checkedData.length < 1 && uncheckedData.length < 1} setExportData={provideExportData} />
                    <button type="button" onClick={() => setDisplayEdit(true)} className="px-5 py-2.5 w-full h-full item-center justify-center rounded text-white text-sm border-none outline-none bg-cyan-500 dark:bg-cyan-800 hover:enabled:bg-cyan-700 hover:enabled:cursor-pointer disabled:opacity-50">
                        <p>New entry</p>
                        <PlusIcon className="size-6 inline-flex" />
                    </button>
                    <button type="button" onClick={() => setDisplayDeleteConfirm(true)} className="px-5 py-2.5 w-full h-full item-center justify-center rounded text-white text-sm border-none outline-none bg-orange-500 dark:bg-orange-800 hover:enabled:bg-orange-700 hover:enabled:cursor-pointer disabled:opacity-50">
                        <p>Delete all & reset</p>
                        <ArrowPathRoundedSquareIcon className="size-6 inline-flex" />
                    </button>
                </div>
            </div>
            <EditItem show={displayEdit} onCancel={() => setDisplayEdit(false)} onConfirm={handleNewRecord} />
            <hr className="solid text-gray-600 dark:text-gray-400" />
            <h5 className="text-xl text-black dark:text-white font-bold">
                To-Do: {uncheckedData.length}
            </h5>
            <div className="w-full text-black dark:text-white grid gap-2 py-5">
                <DndContext modifiers={[restrictToParentElement]} onDragEnd={handleDrag}>
                    <SortableContext items={uncheckedData} strategy={verticalListSortingStrategy}>
                        {(() => {
                            const renderedItems = [];
                            let groups: string[] = [];
                            for (const data of uncheckedData) {
                                let groupIndex = groups.findIndex(groupEntry => groupEntry === data.group);
                                if (groupIndex == -1) {
                                    groups.push(data.group);
                                    groupIndex = groups.length - 1;
                                }
                                renderedItems.push(<SortItem key={data.id} data={data} groupIndex={groupIndex} toggleCheck={() => markAsComplete(data)} onDelete={() => handleUncheckedDelete(data.id)} onUpdate={(text, notes, group) => handleUncheckedEdit(data.id, text, notes, group)} />);
                            }
                            return renderedItems;
                        })()}
                    </SortableContext>
                </DndContext>
            </div>
            <hr className="solid text-gray-600 dark:text-gray-400" />
            <h5 className="text-xl text-black dark:text-white font-bold">
                Completed: {checkedData.length}
            </h5>
            <div className="w-full text-black dark:text-white grid gap-2 py-5">
                {checkedData.map(data => {
                    return (<SortItem key={data.id} data={data} toggleCheck={() => setAsToDo(data)} onDelete={() => { }} onUpdate={(text, notes, group) => handleCheckedEdit(data.id, text, notes, group)} />)
                })}
            </div>
            <DeleteConfirmation data={{ id: 'delete-id', text: 'All Items', notes: '', checked: false, group: DEFAULT_GROUP }} additionalCautionMessage={'NOTE: This will delete all your entries. If you wish to export your content, hit cancel & download data as csv'} show={displayDeleteConfirm} onCancel={() => setDisplayDeleteConfirm(false)} onConfirm={handleDeleteConfirmed} />
        </div>
    );
};

export default SorterTool;