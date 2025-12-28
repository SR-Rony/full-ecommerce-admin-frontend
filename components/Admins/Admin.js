import { useFullStage } from "@/hooks/useFullStage";
import Paginate from "@/shared/Paginate/Paginate";
import { ProfileAvatarOutput, isValidArray } from "@/utils/func";
import { getAdmins } from "@/utils/instance";
import _, { capitalize } from "lodash";
import moment from "moment";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import useClickOutSide from "@/hooks/useClickOutside";
import { BsFilter } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import EmptyTableSectionTwo from "../EmptyDataSection/EmptyTableSectionTwo";
import AddNewAdminModal from "../Modals/Admins/AddNewAdminModal";
import AdminActiveModal from "../Modals/Admins/AdminActiveModal";
import AdminSuperAdminActiveModal from "../Modals/Admins/AdminSuperAdminActiveModal";
import AdminSuperAdminDeactivateModal from "../Modals/Admins/AdminSuperAdminDeactivateModal";
import AdminBlockedModal from "../Modals/Admins/AdminsBlockedModal";
import EditAdminModal from "../Modals/Admins/EditAdminModal";
import ActionAdmins from "./ActionAdmins";
import AdminFilterSelect, { searchOptions } from "./AdminFilterSelect";
import AdminStatusFilter from "./AdminStatusFilter";
import FilterAdmins from "./FilterAdmins";
import SearchAdmins from "./SearchAdmins";
import SortAdminsSelect from "./SortAdminsSelect";

const Admin = (params = {}) => {
  const {
    adminName,
    email,
    isEmailVerified,
    isBlocked,
    adminIds,
    startDate,
    endDate,
    sort,
  } = params;
  const [allData, setAllData] = useState([]);
  const [isPopup, setPopup] = useState(false);
  const popupRef = useRef(null);
  const { Admin } = useFullStage();
  const [adminSingleDetails, setAdminSingleDetails] = Admin.AdminSingleDetails;
  const [adminPage, setAdminPage, adminLimit, setAdminLimit] =
    Admin.AdminPaginate;
  const [admins, setAdmins] = Admin.Admins;
  const [initPaginate, setInitPaginate] = useState(false);
  const [isRequestAdmin, setIsRequestAdmin] = useState(false);
  const [query, setQuery] = useState({});
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
  const [isActiveModalOpen, setIsActiveModalOpen] = useState(false);
  const [isSuperAdminActiveModalOpen, setIsSuperAdminActiveModalOpen] =
    useState(false);
  const [isSuperAdminDeactivateModalOpen, setIsSuperAdminDeactivateModalOpen] =
    useState(false);
  const [adminModalCreateOpen, setAdminModalCreateOpen] = useState(false);
  const [adminModalEditOpen, setAdminModalEditOpen] = useState(false);
  const [adminUpdateData, setAdminUpdateData] = useState({});
  const [adminData, setAdminData] = useState({});
    const [updateData, setUpdateData] = useState({
    // isBlocked: false,
    // isEmailVerified: true,
    // isSuperAdmin: true,
    // isActive: true,
    // selectedRole: { name: "Vendor", value: "vendor" },
    // role: "vendor",
    // vendorSites: [],
  });
  // Create a state variable to track selected items
  const [selectedItems, setSelectedItems] = useState([]);
  const router = useRouter();
  useEffect(() => {
    if (params && Object.values(params).length) {
      setQuery(params);
    }
  }, [params]);
  // Function to handle the "Select All" checkbox click event
  const handleSelectAllClick = () => {
    setSelectAllChecked(!selectAllChecked);
    setAdminData((prev) => {
      return {
        ...prev,
        menuOpen: !selectAllChecked,
      };
    });
    // Update the state of individual checkboxes in the tbody
    if (selectAllChecked) {
      setAdminSingleDetails((prev) => {
        return {
          ...prev,
          adminIds: [],
        };
      });
      setSelectedItems([]);
    } else {
      const allIds = isValidArray(admins?.data)
        ? admins?.data.map((item) => item._id)
        : [];

      setSelectedItems(allIds);
      setAdminSingleDetails((prev) => {
        return {
          ...prev,
          adminIds: allIds,
        };
      });
    }
  };

  // Function to handle individual checkbox clicks
  const handleCheckboxClick = (id) => {
    setAdminData((prev) => {
      return {
        ...prev,
        menuOpen: true,
      };
    });

    if (selectedItems.includes(id)) {
      const lists = selectedItems.filter((item) => item !== id);
      if (lists.length == 0) {
        setAdminData((prev) => {
          return {
            ...prev,
            menuOpen: false,
          };
        });
      }
      setSelectedItems(lists);
      setAdminSingleDetails((prev) => {
        return {
          ...prev,
          adminIds: lists,
        };
      });
    } else {
      const allIds = [...selectedItems, id];
      setSelectedItems(allIds);
      setAdminSingleDetails((prev) => {
        return {
          ...prev,
          adminIds: allIds,
        };
      });
    }

    // Check if all individual checkboxes are selected and update the "Select All" checkbox accordingly
    const allSelected = selectedItems.length === allData.length;

    setSelectAllChecked(allSelected);
  };

  const fetchAdmins = async () => {
    try {
      setIsRequestAdmin(true);
      const queryFilter = {
        adminIds: adminIds ?? "",
        adminName: adminName ?? "",
        email: email ?? "",
        isBlocked: isBlocked ?? "",
        isEmailVerified: isEmailVerified ?? "",
        startDate: startDate ?? "",
        endDate: endDate ?? "",
        sort: sort ?? "latest",
        page: 1,
        limit: adminLimit,
      };
      const res = await getAdmins(queryFilter);
      setIsRequestAdmin(false);
      const adminIdsArr = isValidArray(res?.data?.data)
        ? res?.data?.data.map((id) => id?._id)
        : [];
      setAllData(adminIdsArr);
      setAdmins(res?.data);
    } catch (error) {
      //console.log(error);
      setIsRequestAdmin(false);
      /* empty */
    }
  };

  useEffect(() => {
    fetchAdmins();
    setQuery((prev) => {
      return {
        ...prev,
        selectedSearchInput: searchOptions[0],
      };
    });
  }, []);

  const fetchAdminsQueries = async (val) => {
    try {
      setIsRequestAdmin(true);
      const res = await getAdmins(val || query);

      // if (res?.data?.success == false) {
      //   ToastEmitter('error', res?.data?.message);
      // }
      setIsRequestAdmin(false);
      const adminIdsArr = isValidArray(res?.data?.data)
        ? res?.data?.data.map((id) => id?._id)
        : [];
      setAllData(adminIdsArr);
      setAdmins(res?.data);
    } catch (error) {
      // ToastEmitter('error', error?.response?.data.message);
      // //console.log(error);
      setIsRequestAdmin(false);
      return false;
      /* empty */
    }
  };

  const fetchPaginateAdmins = async () => {
    try {
      setIsRequestAdmin(true);
      const queryFilter = { ...query, page: adminPage || 1, limit: adminLimit };
      const res = await getAdmins(queryFilter);

      setIsRequestAdmin(false);
      const adminIdsArr = isValidArray(res?.data?.data)
        ? res?.data?.data.map((id) => id?._id)
        : [];
      setAllData(adminIdsArr);
      setAdmins(res?.data);
    } catch (error) {
      setIsRequestAdmin(false);
      /* empty */
    }
  };

  useMemo(() => {
    if (initPaginate) {
      fetchPaginateAdmins();
    }
  }, [adminPage]);

  function handleDebounceFn(val) {
    fetchAdminsQueries(val);
  }

  const debounceFn = useCallback(_.debounce(handleDebounceFn, 1000), []);

  function handleChange(value) {
    const val = { ...query, q: value };
    setQuery(val);
    debounceFn(val);
  }
  const resetHandler = async () => {
    setQuery((prev) => {
      return {
        ...{},
        selectedSearchInput: searchOptions[0],
      };
    });

    await fetchAdmins();
    return true;
  };

  useClickOutSide(popupRef, () => {
    setPopup(false);
  });

  return (
    <div>
      <div className="box my-2 lg:my-4">
        <div className="text-right bg-white  px-4  lg:px-8 pt-4 flex gap-2 justify-end uppercase">
          {" "}
          <p>Total Admins ({admins?.paginate?.totalCount || 0})</p>{" "}
        </div>
        <div className="">
          <div className="flex  flex-wrap justify-between   items-center  px-4  lg:px-8 pt-4 gap-2   md:gap-4">
            <div className="flex  flex-wrap  items-center gap-4">
              <h5 className="box-title my-auto">Admins</h5>
              <AdminFilterSelect
                value={query?.selectedSearchInput}
                setQuery={setQuery}
              />
              <SearchAdmins onChangeHandler={handleChange} query={query} />
            </div>
            {/* <|======================| Large Screen |======================|> */}
            <div className=" hidden  lg:flex flex-wrap items-center gap-4">
              <button
                className="bg-blue-500 px-4 py-1 rounded-[3px] text-white"
                onClick={() => setAdminModalCreateOpen(true)}
              >
                {" "}
                Add Admin
              </button>
              {selectedItems?.length !== 0 && adminData?.menuOpen && (
                <>
                  <div>
                    <ActionAdmins
                      setSelectedItems={setSelectedItems}
                      setAdminUpdateData={setAdminUpdateData}
                      value={adminUpdateData}
                      setIsBlockedModalOpen={setIsBlockedModalOpen}
                      setIsActiveModalOpen={setIsActiveModalOpen}
                      setIsSuperAdminActiveModalOpen={
                        setIsSuperAdminActiveModalOpen
                      }
                      setIsSuperAdminDeactivateModalOpen={
                        setIsSuperAdminDeactivateModalOpen
                      }
                    />
                  </div>{" "}
                  |
                </>
              )}
              <div>
                <FilterAdmins
                  setQuery={setQuery}
                  query={query}
                  resetHandler={resetHandler}
                  fetchAdminsQueries={fetchAdminsQueries}
                />
              </div>{" "}
              |
              <div>
                <SortAdminsSelect
                  setQuery={setQuery}
                  query={query}
                  resetHandler={resetHandler}
                  fetchAdminsQueries={fetchAdminsQueries}
                />
              </div>
              |
              <div>
                <AdminStatusFilter
                  setQuery={setQuery}
                  query={query}
                  resetHandler={resetHandler}
                  fetchAdminsQueries={fetchAdminsQueries}
                />
              </div>
            </div>
            {/* <|======================| Small Screen |======================|> */}
            <div className=" w-full flex flex-wrap items-center gap-4 lg:hidden justify-between">
              <button
                className="bg-blue-500 px-4 py-1 rounded-[3px] text-white"
                onClick={() => setAdminModalCreateOpen(true)}
              >
                {" "}
                Add Admin
              </button>

              <button
                onClick={() => {
                  setPopup(true);
                }}
                className="flex items-center gap-1 cursor-pointer border border-blue-500 text-blue-500 px-2 py-1 rounded-[3px]  "
              >
                <BsFilter size={16} />
              </button>

              {isPopup && (
                <div className="fixed  top-0 left-0 w-screen h-screen  bg-slate-700 bg-opacity-20 z-50 ">
                  <div
                    ref={popupRef}
                    className="absolute m-auto inset-0  w-fit  h-fit p-4  bg-white rounded-lg   flex  items-center justify-center gap-4 flex-wrap"
                  >
                    <div className="bg-slate-100 px-2 rounded-[3px] z-40">
                      <FilterAdmins
                        setPopup={setPopup}
                        setQuery={setQuery}
                        query={query}
                        resetHandler={resetHandler}
                        fetchAdminsQueries={fetchAdminsQueries}
                      />
                    </div>{" "}
                    <div className="bg-slate-100 px-2 rounded-[3px] z-40">
                      <SortAdminsSelect
                        setPopup={setPopup}
                        setQuery={setQuery}
                        query={query}
                        resetHandler={resetHandler}
                        fetchAdminsQueries={fetchAdminsQueries}
                      />
                    </div>
                    <div className="bg-slate-100 px-2 rounded-[3px] z-40">
                      <AdminStatusFilter
                        setQuery={setQuery}
                        setPopup={setPopup}
                        query={query}
                        resetHandler={resetHandler}
                        fetchAdminsQueries={fetchAdminsQueries}
                      />
                    </div>{" "}
                    {selectedItems?.length !== 0 && adminData?.menuOpen && (
                      <div className="px-2 bg-slate-100 rounded-[3px]">
                        <ActionAdmins
                          setPopup={setPopup}
                          setSelectedItems={setSelectedItems}
                          setAdminUpdateData={setAdminUpdateData}
                          value={adminUpdateData}
                          setIsBlockedModalOpen={setIsBlockedModalOpen}
                          setIsActiveModalOpen={setIsActiveModalOpen}
                          setIsSuperAdminActiveModalOpen={
                            setIsSuperAdminActiveModalOpen
                          }
                          setIsSuperAdminDeactivateModalOpen={
                            setIsSuperAdminDeactivateModalOpen
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="box-body">
          <div className="table-bordered whitespace-nowrap rounded-sm overflow-auto">
            <table className="ti-custom-table ti-custom-table-head edit-table">
              <thead className="bg-gray-100 dark:bg-black/20">
                <tr className="">
                  <th scope="col" className="dark:text-white/70">
                    <div className="flex leading-[0] justify-center">
                      <input
                        type="checkbox"
                        className="border-gray-500 ti-form-checkbox mt-0.5"
                        onChange={handleSelectAllClick}
                        checked={selectAllChecked}
                        id="hs-default-checkbox"
                      />
                      <label
                        htmlFor="hs-default-checkbox"
                        className="text-sm text-gray-500 dark:text-white/70"
                      ></label>
                    </div>
                  </th>
                  <th scope="col" className="dark:text-white/70">
                    Admin Name
                  </th>
                  <th scope="col" className="dark:text-white/70">
                    Email
                  </th>
                  <th scope="col" className="dark:text-white/70">
                   Role
                  </th>
                  <th scope="col" className="dark:text-white/70">
                   Vendor Sites
                  </th>
                  <th scope="col" className="dark:text-white/70">
                    Mail Status
                  </th>
                  <th scope="col" className="dark:text-white/70">
                    Active Status
                  </th>
                  <th scope="col" className="dark:text-white/70">
                    CreatedAt
                  </th>
                  <th scope="col" className="!text-end dark:text-white/70">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {isValidArray(admins?.data) &&
                  admins?.data.map((admin, i) => (
                    <tr className="order-list" key={i}>
                      <td className="">
                        <div className="flex items-center h-5 product-checkbox justify-center">
                          <input
                            id="product-check-1"
                            type="checkbox"
                            className="border-gray-500 ti-form-checkbox"
                            value=""
                            aria-label="..."
                            onChange={() => handleCheckboxClick(admin?._id)}
                            checked={selectedItems.includes(admin?._id)}
                          />
                          <label htmlFor="product-check-1" className="sr-only">
                            Checkbox
                          </label>
                        </div>
                      </td>
                      <td
                        className="font-semibold cursor-pointer pl-2  "
                        onClick={() =>
                          router.push(`/admin/users/${admin?._id}`)
                        }
                      >
                        <div className="flex cursor-pointer items-center gap-2 flex-wrap">
                          <img
                            src={ProfileAvatarOutput(admin?.avatar)}
                            className="w-[40px] h-[40px] rounded-[100%]"
                            alt=""
                          />
                          {admin?.firstName || "---"}{" "}
                          {admin?.lastName || "----"}
                        </div>
                      </td>
                     
                      <td className="pl-2 ">{admin?.email}</td>
                      <td className="pl-2 ">
                        {admin?.role=='superAdmin' ? "Super Admin" : capitalize(admin?.role)}
                      </td>
                      <td className="pl-2 ">
                        {
                          isValidArray(admin?.vendorSites) ? admin?.vendorSites.map((item, i, arr) => {
                            return <span key={i}>{item=='hb'?capitalize("Hammer and bell"):capitalize(item)}{i < arr.length - 1 && ','}<br></br></span>;
                          }):"N/A"
                        }
                      </td>
                      <td className="pl-2 ">
                        {admin?.isEmailVerified ? "Verified" : "Unverified"}
                      </td>

                      <td className="pl-2 ">
                        {admin?.isBlocked ? "Blocked" : "Active"}
                      </td>

                      <td className="pl-2 ">
                        {moment(admin?.createdAt).format("YYYY-MM-DD")}
                      </td>
                      <td className="pl-2  text-end font-medium">
                        <button
                          aria-label="anchor"
                          className="ti-btn rounded-full p-0 transition-none focus:outline-none ti-btn-soft-info"
                          onClick={() =>{
                            setAdminModalEditOpen(true);
                            const data={
                              ...admin,
                              selectedRole: { name: admin?.role=="superAdmin"? "Super Admin":admin?.role, value: admin?.role },
                              selectedVendorSites: isValidArray(admin?.vendorSites)?admin?.vendorSites.map((item,i) => {
                                return { name: item=='hb'?capitalize("Hammer and bell"):capitalize(item),value:item, id: i };
                              }):[],
                            };

                            // console.log(data,"site vendor");
                            setUpdateData(data);
                          }
                  
                          }
                        >
                    <FaEdit />

                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>{" "}
          {!isRequestAdmin && admins?.data?.length === 0 && (
            <>
              {/* <main
                  id="content"
                  className="mx-auto block w-full min-h-[300px] mt-6"
                >
                  <div className="text-center py-10 px-4 sm:px-6 lg:px-8">
                    <h1 className="block font-bold text-xl my-2">
                      Search No Result
                    </h1>
                    <p>
                      We're sorry. We cannot find any matches for your search
                      term.
                    </p>
                  </div>
                </main> */}
              <div className="w-10/12 py-4  md:w-6/12  mx-auto">
                <EmptyTableSectionTwo />
              </div>
            </>
          )}
          <div className="mt-6">
            <Paginate
              setCurrentPage={setAdminPage}
              totalPages={admins?.paginate?.totalPage || 0}
              currentPage={adminPage}
              setInitPaginate={setInitPaginate}
            />
          </div>
        </div>
      </div>
      <AdminBlockedModal
        setSelectAllChecked={setSelectAllChecked}
        setSelectedItems={setSelectedItems}
        fetchAdmins={fetchAdminsQueries}
        isOpen={isBlockedModalOpen}
        setIsOpen={setIsBlockedModalOpen}
      />
      <AdminActiveModal
        setSelectAllChecked={setSelectAllChecked}
        setSelectedItems={setSelectedItems}
        fetchAdmins={fetchAdminsQueries}
        isOpen={isActiveModalOpen}
        setIsOpen={setIsActiveModalOpen}
      />

      <AdminSuperAdminActiveModal
        setSelectAllChecked={setSelectAllChecked}
        setSelectedItems={setSelectedItems}
        fetchAdmins={fetchAdminsQueries}
        isOpen={isSuperAdminActiveModalOpen}
        setIsOpen={setIsSuperAdminActiveModalOpen}
      />
      <AdminSuperAdminDeactivateModal
        setSelectAllChecked={setSelectAllChecked}
        setSelectedItems={setSelectedItems}
        fetchAdmins={fetchAdminsQueries}
        isOpen={isSuperAdminDeactivateModalOpen}
        setIsOpen={setIsSuperAdminDeactivateModalOpen}
      />

      <AddNewAdminModal
        isOpen={adminModalCreateOpen}
        setIsOpen={setAdminModalCreateOpen}
        fetchAdmins={fetchAdmins}
      />
      <EditAdminModal
      isOpen={adminModalEditOpen}
      setIsOpen={setAdminModalEditOpen}
      fetchAdmins={fetchAdmins}
      setUpdateData={setUpdateData} updateData={updateData}/>
    </div>
  );
};

export default Admin;
