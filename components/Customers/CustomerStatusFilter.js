import Loader from "@/shared/Loader/Loader";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
export const optionStatusFilter = [
 {
    label: "All",
    keys: "isBlocked",
    value: "",
  },
  {
    label: "Account (Approved)",
    keys: "isAccountApproved",
    value: true,
  },
  {
    label: "Account (Approval Required)",
    keys: "isAccountApproved",
    value: false,
  },
  {
    label: "Active (Unblocked)",
    keys: "isBlocked",
    value: false,
  },
  {
    label: "Account  (Blocked)",
    keys: "isBlocked",
    value: true,
  },
  {
    label: "Account  (Email Verified)",
    keys: "isEmailVerified",
    value: true,
  },
  {
    label: "Account  (Email Unverified)",
    keys: "isEmailVerified",
    value: false,
  },
];

export const defaultOptionStatusFilter = [
  {
    label: "All",
    keys: "isBlocked",
    value: "",
  },
  {
    label: "Account (Approved)",
    keys: "isAccountApproved",
    value: true,
  },
  {
    label: "Account (Approval Required)",
    keys: "isAccountApproved",
    value: false,
  },
  {
    label: "Active (Unblocked)",
    keys: "isBlocked",
    value: false,
  },
  {
    label: "Account  (Blocked)",
    keys: "isBlocked",
    value: true,
  },
  {
    label: "Account  (Email Verified)",
    keys: "isEmailVerified",
    value: true,
  },
  {
    label: "Account  (Email Unverified)",
    keys: "isEmailVerified",
    value: false,
  },
];
const CustomerStatusFilter = ({
  fetchCustomersQueries,
  query,
  setQuery,
  resetHandler,
  setPopup,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isResetRequest, setIsResetRequest] = useState(false);
  const [isFilterRequest, setIsFilterRequest] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown);

    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  const resetHandlerClick = async () => {
    try {
        setIsResetRequest(true);
       await fetchCustomersQueries({
        selectedSearchInput: searchOptions[0],
        isTestCustomer: pathname === "/admin/customers/test-customers/" ? pathname === "/admin/customers/test-customers/" || isTestCustomer : isTestCustomer,
        site: {
          label: "All",
          value: "all",
        },
        siteUserOption: { label: "All", value: "", keys: "isBlocked" },
      });
    } catch (error) {
      console.error("Error resetting filter:", error);
    } finally {
      setIsOpen(false);
      setIsResetRequest(false);
    }
  };

  const filterHandlerClick = async (status) => {

    const filterQuery = { ...query, siteUserOption: status   };
    setIsFilterRequest(true);

    setQuery(filterQuery);
    if (filterQuery && filterQuery?.startDate) {
      if (!filterQuery?.endDate) {
        filterQuery["endDate"] = new Date();
      }
    }
    await fetchCustomersQueries(filterQuery);
    setIsFilterRequest(false);
  };
  return (
    <div>
      <div className="relative inline-block text-left z-20" ref={dropdownRef}>
        <button
          onClick={() => {
            toggleDropdown();
          }}
          type="button"
          className={`flex items-center !capitalize gap-1    cursor-pointer w-full text-sm font-medium  border border-transparent  focus:ring-white relative  ${setPopup
            ? "py-1 rounded-[3px] px-2 bg-slate-100 hover:bg-slate-200"
            : "py-2 rounded-md "
            }  `}
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
        >
          <FaFilter size={13} />
          {query?.siteUserOption?.label || "All"}
        </button>

        {isOpen && (
          <div
            className="origin-top-right  p-4 absolute right-[0px]  mt-2 w-[200px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-1">
                {" "}
                <FaFilter size={13} /> <span>Status</span>
              </div>
              {isResetRequest ? (
                <Loader bg="transparent" width={"w-5"} height={"h-5"} />
              ) : (
                <button onClick={() => resetHandlerClick()}>Reset</button>
              )}
            </div>
            <div className="py-1">
              {optionStatusFilter.map((option, index) => (
                <div className="relative" key={index}>
                  <button
                    type="button"
                    className={`block ${index < optionStatusFilter.length - 1 ? "border-b" : ""
                      } !text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                    role="menuitem"
                    onClick={() => {
                      console.log(option, "opition");
                      setPopup && setPopup(false);
                      filterHandlerClick(option);
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

export default CustomerStatusFilter;
