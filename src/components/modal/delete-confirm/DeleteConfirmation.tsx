import DataEntry from "../../../model/DataEntry"
import Modal from "../base/Modal";
import { ModalType } from "../base/type";

interface DeleteConfirmationProps {
    data: DataEntry;
    show: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteConfirmation = (props: DeleteConfirmationProps) => {
    return (
        <Modal type={ModalType.ERROR_CONFIRM} show={props.show} headerText="Delete confirmation" confirmText="Delete" onConfirm={props.onConfirm} cancelText="Cancel" onCancel={props.onCancel}>
            <p className="text-sm text-gray-500 dark:text-gray-300 px-8">Are you sure you want to delete the entry "<span className="font-bold">{props.data.text}</span>"?</p>
        </Modal>
    )
};

export default DeleteConfirmation;