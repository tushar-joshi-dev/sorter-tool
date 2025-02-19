import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import DataEntry from "../../../model/DataEntry"
import Modal from "../base/Modal";
import { ModalType } from "../base/type";

interface DeleteConfirmationProps {
    data: DataEntry;
    additionalCautionMessage?: string;
    show: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteConfirmation = (props: DeleteConfirmationProps) => {
    return (
        <Modal type={ModalType.ERROR_CONFIRM} show={props.show} headerText="Delete confirmation" confirmText="Delete" onConfirm={props.onConfirm} cancelText="Cancel" onCancel={props.onCancel}>
            <p className="text-sm text-gray-500 dark:text-gray-300 px-8 py-2">Are you sure you want to delete <span className="font-bold">{props.data.text}</span>?</p>
            {props.additionalCautionMessage && (
                <div className="w-full text-yellow-600 dark:text-yellow-400 inline-flex rounded-lg bg-yellow-100 dark:bg-yellow-900 border border-dashed border-yellow-400 p-2">
                    <ExclamationTriangleIcon className="size-6 inline-flex text-yellow-500" />
                    <p className="text-sm">{props.additionalCautionMessage}</p>
                </div>
            )}
        </Modal>
    )
};

export default DeleteConfirmation;