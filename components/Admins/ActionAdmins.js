import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import { useEffect, useRef, useState } from "react";
import { BsBoxFill } from "react-icons/bs";

const ActionAdmins = ({
  handleStatusUpdate,
  setIsBlockedModalOpen,
  setIsActiveModalOpen,
  value,
  setAdminUpdateData,
  setIsSuperAdminDeactivateModalOpen,
  setIsSuperAdminActiveModalOpen,
  setPopup,
}) => {
  const { Order } = useFullStage();
  const [orderSingleDetails, setOrderSingleDetails] = Order.OrderSingleDetails;
  const [isResetRequest, setIsResetRequest] = useState(false);
  const [isUpdateRequest, setIsUpdateRequest] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = (condition = false) => {
    setAdminUpdateData((prev) => {
      return {
        ...prev,
        menuOpen: condition,
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
      label: "Admin Activate",
      keys: "isBlocked",
      value: false,
    },
    {
      label: "Admin Blocked",
      keys: "isBlocked",
      value: true,
    },
    {
      label: "Super Admin Activate",
      keys: "isSuperAdmin",
      value: true,
    },
    {
      label: "Super Admin Deactivate",
      keys: "isSuperAdmin",
      value: false,
    },
  ];
  const resetHandlerClick = async () => {
    toggleDropdown(false);
  };
  const handleStatusUpdater = async (opt) => {
    if (opt.keys == "isBlocked") {
      if (opt.value == true) {
        setIsBlockedModalOpen(true);
        toggleDropdown(false);
      }
      if (opt.value == false) {
        setIsActiveModalOpen(true);
        toggleDropdown(false);
      }
    }
    if (opt.keys == "isSuperAdmin") {
      if (opt.value == true) {
        setIsSuperAdminActiveModalOpen(true);
        toggleDropdown(false);
      }
      if (opt.value == false) {
        setIsSuperAdminDeactivateModalOpen(true);
        toggleDropdown(false);
      }
    }

    setAdminUpdateData((prev) => {
      return {
        ...prev,
        ...opt,
      };
    });
    setIsUpdateRequest(true);

    // api calling
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
          <BsBoxFill size={15} />

          {
            // value?.label ||

            "Actions"
          }
        </button>

        {value?.menuOpen && (
          <div
            className="origin-top-right  p-4 absolute md:right-[0px]  mt-2 w-[236px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
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
                    className={`block ${
                      index < options.length - 1 ? "border-b" : ""
                    } !text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                    role="menuitem"
                    onClick={() => {
                      setPopup && setPopup(false);
                      handleStatusUpdater(option);
                      toggleDropdown();
                    }}
                  >
                    {option.label}
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

export default ActionAdmins;
