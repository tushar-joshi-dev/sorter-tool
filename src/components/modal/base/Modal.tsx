import { ReactNode } from "react";
import useOutsideClick from "../../../hooks/OutsideClick";
import { ModalType } from "./type";

interface ModalProps {
    type: ModalType;
    show: boolean;
    headerText: string;
    children: ReactNode;
    confirmText: string;
    onConfirm: () => void;
    cancelText: string;
    onCancel: () => void;
}

const Modal = (props: ModalProps) => {
    const ref = useOutsideClick(() => {
        if (props.show) {
            console.log('Outside click');
            props.onCancel();
        }
    });

    const parentClass = props.show ? "flex" : "hidden";
    const confirmButtonClass = props.type === ModalType.ERROR_CONFIRM ? "bg-red-500 dark:bg-red-800 hover:bg-red-600 dark:hover:bg-red-700 border-red-500 dark:border-red-700" : "bg-green-500 dark:bg-green-800 hover:bg-green-600 dark:hover:bg-green-700 border-green-500 dark:border-green-800";

    return (
        <div className={`min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover ${parentClass}`}>
            <div className="absolute bg-black opacity-50 inset-0 z-0"></div>
            <div ref={ref} className="w-full text-black dark:text-white max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-white dark:bg-gray-800 ">
                <div className="text-center p-5 flex-auto justify-center">
                    <h4 className="text-xl font-bold py-4 ">{props.headerText}</h4>
                    {props.children}
                </div>
                <div className="p-3 mt-2 text-center space-x-4 md:block">
                    <button onClick={props.onCancel} className="mb-2 md:mb-0 bg-white dark:bg-gray-800 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 dark:text-gray-300 rounded hover:shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        {props.cancelText}
                    </button>
                    <button onClick={props.onConfirm} className={`mb-2 md:mb-0 border px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded hover:shadow-lg cursor-pointer ${confirmButtonClass}`}>
                        {props.confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;