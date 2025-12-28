/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import EmptyTableSectionTwo from "@/components/EmptyDataSection/EmptyTableSectionTwo";
import ContactUpdateModal from "@/components/Modals/Contact/ContactUpdateModal";
import CreateContactCategoriesModal from "@/components/Modals/ContactCategories/CreateContactCategoriesModal";
import DropdownContact from "@/components/Shared/DropdownContact";
import OrderSiteStatus from "@/components/Shared/OrderSiteStatus";
import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import Paginate from "@/shared/Paginate/Paginate";
import Contentlayout from "@/shared/layout-components/layout/content-layout";
import { isValidArray } from "@/utils/func";
import { getContactCategories, getContactCustomers } from "@/utils/instance";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";

const Contact = () => {
  const { Settings } = useFullStage();
  const [appInfoSetting, setAppInfoSetting] = Settings.AppInfoSetting;
  const [updateData, setUpdateData] = useState({});
  const [isRequest, setIsRequest] = useState(false);
  const [isLogoRequest, setIsLogoRequest] = useState(false);
  const [contactCategoriesModalOpen, setContactCategoriesModalOpen] =
    useState(false);
  const [contactUpdateModalOpen, setContactUpdateModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [data, setData] = useState({});
  const [initPaginate, setInitPaginate] = useState(false);
  const [contactCategories, setContactCategories] = useState({});
  const [selectedContact, setSelectedContact] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState({
    site: { label: "All Sites", value: "" },
  });
  function handleDebounceFn(val) {
    fetchGetContactCustomersQuery(val);
  }

  const debounceFn = useCallback(_.debounce(handleDebounceFn, 1000), []);

  const handleSearch = (event) => {
    setQuery({ q: event.target.value });
    setSearchTerm(event.target.value);
    debounceFn({ q: event.target.value });
  };

  const fetchGetContactCustomers = async () => {
    try {
      setIsRequest(true);
      const res = await getContactCustomers();
      setIsRequest(false);
      // console.log(res.data);
      setData(res?.data);
    } catch (error) {
      setIsRequest(false);
      console.log(error);
    }
  };
  const fetchGetContactCustomersQuery = async (val = {}) => {
    try {
      setIsRequest(true);
      const res = await getContactCustomers({
        ...query,
        page: 1,
        limit: 20,
        ...val,
      });
      setIsRequest(false);
      // console.log(res.data);
      setData(res?.data);
    } catch (error) {
      setIsRequest(false);
      console.log(error);
    }
  };
  const fetchGetContactCustomersPaginate = async () => {
    try {
      setIsRequest(true);
      const res = await getContactCustomers({ page: page, limit: 20 });
      setIsRequest(false);
      setData(res?.data);
    } catch (error) {
      setIsRequest(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetchGetContactCustomers();
    fetchContactCategories();
  }, []);

  useEffect(() => {
    if (initPaginate) {
      fetchGetContactCustomersPaginate();
    }
  }, [page]);
  // console.log(appInfoSetting, 'appInfo setting');

  const fetchContactCategories = async () => {
    try {
      const res = await getContactCategories({ page: page, limit: 20 });
      setContactCategories(res.data);
    } catch (error) {}
  };

  const onChangesContact = async (value) => {
    if (value?.value === "All") {
      setSelectedContact(value);
      setQuery((prev) => {
        return {
          ...prev,
          contactCategoryId: "",
        };
      });

      await fetchGetContactCustomersQuery({ contactCategoryId: "" });
    } else {
      setSelectedContact(value);
      setQuery((prev) => {
        return {
          ...prev,
          contactCategoryId: value?._id,
        };
      });

      await fetchGetContactCustomersQuery({ contactCategoryId: value?._id });
    }
  };

  const onChangeSiteType = async (site) => {
    setQuery({ ...query, site });

    try {
      await fetchGetContactCustomersQuery({ ...query, site });
    } catch (error) {
      console.log(error, " error in hammer bell site filter");
    }
  };
  return (
    <Contentlayout>
      <div className="my-3 p-4 bg-white   md:px-8">
        <div className="space-y-4">
          <div className="w-full ">
            <h2 className="order-1 text-lg font-bold mb-4">
              Contact Information
            </h2>
            <div className="mb-4">
              <div className="flex items-center gap-4 justify-between flex-wrap">
                <div className="order-3 flex lg:items-center  flex-col md:flex-row   gap-4 w-full xl:w-[52%]">
                  <DropdownContact
                    options={contactCategories?.data}
                    selectedOption={selectedContact?.name || ""}
                    onChanges={onChangesContact}
                  />
                  <div className="md:w-4/12 flex     items-center">
                    <input
                      type="text"
                      placeholder="Search"
                      className=" lg:order-2 px-4 py-2 border rounded-lg w-full "
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                </div>

                <div className="w-auto order-2 lg:order-3 flex items-center flex-wrap gap-3">
                  <div className={`border rounded-sm px-1 cursor-pointer `}>
                    <OrderSiteStatus
                      data={updateData}
                      align={"left"}
                      setData={setUpdateData}
                      query={query}
                      onChanges={onChangeSiteType}
                    />
                  </div>

                  <button
                    className="px-4 py-2 bg-blue-500 text-white  rounded-sm"
                    onClick={() => setContactUpdateModalOpen(true)}
                  >
                    {" "}
                    Contact Update
                  </button>
                  <button
                    className=" px-4 py-2 bg-blue-500 text-white  rounded-sm"
                    onClick={() => setContactCategoriesModalOpen(true)}
                  >
                    {" "}
                    Contact Categories
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="">
            {!isRequest && (
              <div className="pt-3 pb-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full leading-normal">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="px-5 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-5 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap"
                        >
                          Contact Category
                        </th>
                        <th
                          scope="col"
                          className="px-5 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                        >
                          Message
                        </th>
                        <th
                          scope="col"
                          className="px-5 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap"
                        >
                          Created At
                        </th>
                        <th
                          scope="col"
                          className="px-5 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                        >
                          Site
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {isValidArray(data?.data) &&
                        data.data?.map((item) => (
                          <tr key={item._id}>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              {item.email}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              {item.contactCategory.name}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              {item.message}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              {new Date(item.createdAt).toLocaleString()}
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              {item?.site ?? "N/A"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {data?.data?.length <= 0 && (
              <div>
                <div className="w-10/12 md:w-6/12 mx-auto py-4">
                  {" "}
                  <EmptyTableSectionTwo />
                </div>
              </div>
            )}
            {isRequest && <Loader />}
          </div>
          {!isRequest && (
            <div className="flex items-center justify-center mx-auto">
              <Paginate
                setCurrentPage={setPage}
                totalPages={data?.paginate?.totalPage || 0}
                currentPage={page}
                setInitPaginate={setInitPaginate}
              />
            </div>
          )}
        </div>
      </div>
      <CreateContactCategoriesModal
        isOpen={contactCategoriesModalOpen}
        setIsOpen={setContactCategoriesModalOpen}
      />
      <ContactUpdateModal
        setIsOpen={setContactUpdateModalOpen}
        isOpen={contactUpdateModalOpen}
      />
    </Contentlayout>
  );
};

export default Contact;
