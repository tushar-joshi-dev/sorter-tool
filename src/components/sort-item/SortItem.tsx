import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DataEntry from "../../model/DataEntry";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { BookmarkIcon, CheckCircleIcon, PencilIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import DeleteConfirmation from "../modal/delete-confirm/DeleteConfirmation";
import { useState } from "react";
import EditItem from "../modal/edit-item/EditItem";

interface SortItemProps {
    data: DataEntry;
    toggleCheck: () => void;
    onDelete: () => void;
    onUpdate: (text: string) => void;
}

const SortItem = (props: SortItemProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.data.id });
    const [displayDeleteConfirm, setDisplayDeleteConfirm] = useState<boolean>(false);
    const [displayEdit, setDisplayEdit] = useState<boolean>(false);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleCheckClick = () => {
        props.toggleCheck();
    };

    const handleDeleteConfirmed = () => {
        setDisplayDeleteConfirm(false);
        props.onDelete();
    };

    const handleEditConfirmed = (text: string) => {
        setDisplayEdit(false);
        props.onUpdate(text);
    };

    const toggleCheckClass = props.data.checked ? "bg-yellow-200 dark:bg-yellow-900" : "bg-blue-200 dark:bg-blue-900";

    return (
        <div ref={setNodeRef} style={style} className={"shadow-sm p-2 rounded flex justify-between gap-2"}>
            <button disabled={props.data.checked} title="Drag to reorder" {...attributes} {...listeners} className="cursor-move disabled:opacity-20 disabled:cursor-not-allowed">
                <ChevronUpDownIcon className="size-6" />
            </button>
            <div className="w-full flex">
                {props.data.text}
                &nbsp;
                <button title="Edit" onClick={() => setDisplayEdit(true)}>
                    <PencilIcon className="size-4 cursor-pointer" />
                </button>
            </div>
            <button title={props.data.checked ? "Set as To-Do" : "Mark as complete"} onClick={handleCheckClick} className={`rounded flex gap-2 w-3xs p-0.5 cursor-pointer ${toggleCheckClass}`}>
                {
                    props.data.checked ? (
                        <>
                            <BookmarkIcon className="size-6" />
                            <p>Set as To-Do</p>
                        </>
                    ) : (
                        <>
                            <CheckCircleIcon className="size-6" />
                            <p>Mark as complete</p>
                        </>
                    )
                }
            </button>
            <button disabled={props.data.checked} title="Remove" onClick={() => setDisplayDeleteConfirm(true)} className="cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed">
                <XMarkIcon className="size-5" />
            </button>
            <EditItem data={props.data} show={displayEdit} onCancel={() => setDisplayEdit(false)} onConfirm={handleEditConfirmed} />
            <DeleteConfirmation data={props.data} show={displayDeleteConfirm} onCancel={() => setDisplayDeleteConfirm(false)} onConfirm={handleDeleteConfirmed} />
        </div>
    );
};

export default SortItem;