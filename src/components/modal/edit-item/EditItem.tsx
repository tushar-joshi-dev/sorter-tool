import { KeyboardEvent, useRef, useState } from "react";
import DataEntry from "../../../model/DataEntry"
import Modal from "../base/Modal";
import { ModalType } from "../base/type";
import { toast, ToastType } from "../../toast/ToastProvider";

interface EditItemProps {
    data?: DataEntry;
    show: boolean;
    onConfirm: (text: string) => void;
    onCancel: () => void;
}

const EditItem = (props: EditItemProps) => {
    const [defaultContent, setDefaultContent] = useState<string>(props.data?.text || '');
    const contentInputRef = useRef<HTMLInputElement>(null);
    const handleConfirm = () => {
        const content = contentInputRef.current?.value;
        if (content === undefined || content === null || content.trim().length < 1) {
            toast('Invalid text provided.', ToastType.WARN);
            return;
        }
        resetField(props.data ? content : '');
        props.onConfirm(content);
    };

    const handleKeydown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleConfirm();
        }
    };

    const handleCancel = () => {
        resetField(props.data?.text || '');
        props.onCancel();
    };

    const resetField = (resetContent: string) => {
        setDefaultContent(resetContent);
        if (contentInputRef.current) {
            contentInputRef.current.value = resetContent;
        }
    };

    return (
        <Modal type={ModalType.UPDATE_CONFIRM} show={props.show} headerText={props.data ? "Edit entry - " + props.data.text : "New entry"} confirmText="Save" onConfirm={handleConfirm} cancelText="Cancel" onCancel={handleCancel}>
            <div className="relative flex items-center text-black dark:text-white">
                <label htmlFor="content" className="text-xs absolute top-[-10px] left-0">Content</label>
                <input ref={contentInputRef} name="content" type="text" defaultValue={defaultContent} onKeyDown={handleKeydown} className="px-2 pt-5 pb-2 bg-white dark:bg-gray-800 w-full text-sm border-b-2 border-gray-100 dark:border-gray-600 focus:border-gray-400 dark:focus:border-gray-500 outline-none" />
            </div>
        </Modal>
    );
};

export default EditItem;