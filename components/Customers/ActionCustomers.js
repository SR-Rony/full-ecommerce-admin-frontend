import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import { useEffect, useRef, useState } from "react";
import {
    BsBoxFill
} from "react-icons/bs";

const ActionCustomers = ({ handleStatusUpdate, setActionType, setIsBlockedModalOpen, setIsActiveModalOpen, setIsEmailVerifiedModalOpen, value, setCustomerUpdateData }) => {
    const { Order } = useFullStage();
    const [orderSingleDetails, setOrderSingleDetails] = Order.OrderSingleDetails;
    const [isResetRequest, setIsResetRequest] = useState(false);
    const [isUpdateRequest, setIsUpdateRequest] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = (condition = false) => {

        setCustomerUpdateData((prev) => {
            return {
                ...prev,
                menuOpen: condition
            };
        });
    };

    const closeDropdown = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            toggleDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", closeDropdown);

        return () => {
            document.removeEventListener("mousedown", closeDropdown);
        };
    }, []);

    const options = [
        {
            label: "Bulk Mark as Approved",
            keys: "isAccountApproved",
            value: true,
        },
        {
            label: "Bulk Mark as Blocked",
            keys: "isBlocked",
            value: true,
        },
        {
            label: "Bulk Mark as Unblocked",
            keys: "isBlocked",
            value: false,
        },
        {
            label: "Bulk Mark Emails as Verified",
            keys: "isEmailVerified",
            value: true,
        },
    ];
    const resetHandlerClick = async () => {
        toggleDropdown(false);
    };
    const handleStatusUpdater = async (opt) => {
        if (opt.keys == 'isBlocked' && opt.value == true) {
            setActionType({ isBlocked: true })
            setIsBlockedModalOpen(true);
            toggleDropdown(false);
        } else
            if (opt.keys == 'isBlocked' && opt.value == false) {
                setActionType({ isBlocked: false })
                setIsBlockedModalOpen(true);
                toggleDropdown(false);
            }
            else
                if (opt.keys == 'isAccountApproved' && opt.value == true) {
                    setActionType({ isAccountApproved: true })
                    setIsActiveModalOpen(true);
                    toggleDropdown(false);
                }
                else
                    if (opt.keys == 'isEmailVerified') {
                        setActionType({ isEmailVerified: true })
                        setIsEmailVerifiedModalOpen(true);
                        toggleDropdown(false);
                    }

        setCustomerUpdateData((prev) => {
            return {
                ...prev,
                ...opt
            };
        });

        setIsUpdateRequest(false);
    };

    return (
        <div>
            <div className="relative inline-block text-left z-20" ref={dropdownRef}>
                <button
                    onClick={toggleDropdown}
                    type="button"
                    className="flex items-center gap-2 cursor-pointer w-full py-2 text-sm font-medium  border border-transparent rounded-md focus:ring-white relative"
                    id="options-menu"
                    aria-haspopup="true"
                    aria-expanded="true"
                >

                    {
                        value?.value == true && <BsBoxFill
                            size={15} />

                    }
                    {
                        value?.value == false && <BsBoxFill size={17} className="pr-1" />

                    }

                    {value?.label || "Actions"}
                </button>

                {value?.menuOpen && (
                    <div
                        className="origin-top-right  p-4 absolute md:right-[0px]  mt-2 w-[200px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                    >
                        <div className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center gap-2">
                                {" "}
                                <BsBoxFill /> Actions
                            </div>
                            {isResetRequest ? (
                                <Loader bg="transparent" width={"w-5"} height={"h-5"} />
                            ) : (
                                <button onClick={() => resetHandlerClick()}>Close</button>
                            )}
                        </div>
                        <div className="py-1">
                            {options.map((option, index) => (
                                <div className="relative" key={index}>
                                    <button
                                        type="button"
                                        className={`
                                            flex items-center gap-2 w-full px-4 py-3
                                            text-sm text-gray-700 
                                            ${index < options.length - 1 ? "border-b border-gray-200" : ""}
                                            hover:bg-gray-50 transition-colors duration-200
                                            focus:outline-none focus:bg-gray-100
                                        `}
                                        role="menuitem"
                                        onClick={() => {
                                            handleStatusUpdater(option);
                                            toggleDropdown();
                                        }}
                                    >
                                        <span className={`
                                            w-2 h-2 rounded-full
                                            ${option.value ? 'bg-green-500' : 'bg-red-500'}
                                        `} />
                                        <span className="flex-1 text-left">
                                            {option.label}
                                        </span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActionCustomers;
