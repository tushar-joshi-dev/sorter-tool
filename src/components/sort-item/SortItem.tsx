import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Linkify from "react-linkify";
import DataEntry from "../../model/DataEntry";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { BookmarkIcon, CheckCircleIcon, PencilIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import DeleteConfirmation from "../modal/delete-confirm/DeleteConfirmation";
import { useState } from "react";
import EditItem from "../modal/edit-item/EditItem";
import { DEFAULT_GROUP_COLOR, GROUP_COLORS, GroupColorPair } from "../../constants/ValueConstants";

interface SortItemProps {
    data: DataEntry;
    groupIndex?: number;
    toggleCheck: () => void;
    onDelete: () => void;
    onUpdate: (text: string, notes: string, group: string) => void;
}

const SortItem = (props: SortItemProps) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.data.id });
    const [displayDeleteConfirm, setDisplayDeleteConfirm] = useState<boolean>(false);
    const [displayEdit, setDisplayEdit] = useState<boolean>(false);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const groupThemePair: GroupColorPair = props.groupIndex === undefined || props.groupIndex === null || props.groupIndex < 0 ? DEFAULT_GROUP_COLOR : GROUP_COLORS[props.groupIndex % GROUP_COLORS.length];

    const handleCheckClick = () => {
        props.toggleCheck();
    };

    const handleDeleteConfirmed = () => {
        setDisplayDeleteConfirm(false);
        props.onDelete();
    };

    const handleEditConfirmed = (text: string, notes: string, group: string) => {
        setDisplayEdit(false);
        props.onUpdate(text, notes, group);
    };

    const toggleCheckClass = props.data.checked ? "bg-yellow-200 dark:bg-yellow-900" : "bg-blue-200 dark:bg-blue-900";

    const linkifyComponentDecorator = (href: string, text: string, key: number) => (
        <a href={href} key={key} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400">
            {text}
        </a>
    );

    return (
        <div ref={setNodeRef} style={style} className={"shadow-sm p-2 rounded flex justify-between gap-2"}>
            <button disabled={props.data.checked} title="Drag to reorder" {...attributes} {...listeners} className="cursor-move disabled:opacity-20 disabled:cursor-not-allowed">
                <ChevronUpDownIcon className="size-6" />
            </button>
            <div className="w-3xs content-center">
                <div className="rounded flex gap-2 py-0.5 w-full justify-center cursor-pointer bg-[var(--bg-light)] text-[var(--text-light)] dark:bg-[var(--bg-dark)] dark:text-[var(--text-dark)]"
                    style={{
                        // Map hex codes to CSS variables
                        '--bg-light': groupThemePair.light.bgColor,
                        '--text-light': groupThemePair.light.color,
                        '--bg-dark': groupThemePair.dark.bgColor,
                        '--text-dark': groupThemePair.dark.color,
                    } as React.CSSProperties} // Cast needed for custom properties in TypeScript
                >
                    {props.data.group}
                </div>
            </div>
            <div className="w-full content-center">
                <div className="w-full flex">
                    {props.data.text}
                    &nbsp;
                    <button title="Edit" onClick={() => setDisplayEdit(true)}>
                        <PencilIcon className="size-4 cursor-pointer" />
                    </button>
                </div>
                <div className="w-full italic whitespace-pre-line text-gray-700 dark:text-gray-300">
                    <Linkify componentDecorator={linkifyComponentDecorator}>
                        {props.data.notes}
                    </Linkify>
                </div>
            </div>
            <div className="w-2xs content-center">
                <button title={props.data.checked ? "Set as To-Do" : "Mark as complete"} onClick={handleCheckClick} className={`rounded flex gap-2 py-0.5 w-full justify-center cursor-pointer ${toggleCheckClass}`}>
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
            </div>
            <button disabled={props.data.checked} title="Remove" onClick={() => setDisplayDeleteConfirm(true)} className="cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed">
                <XMarkIcon className="size-5" />
            </button>
            <EditItem data={props.data} show={displayEdit} onCancel={() => setDisplayEdit(false)} onConfirm={handleEditConfirmed} />
            <DeleteConfirmation data={props.data} show={displayDeleteConfirm} onCancel={() => setDisplayDeleteConfirm(false)} onConfirm={handleDeleteConfirmed} />
        </div>
    );
};

export default SortItem;