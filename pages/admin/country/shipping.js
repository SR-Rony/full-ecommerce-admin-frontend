/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import EmptyTableSection from "@/components/EmptyDataSection/EmptyTableSection";
import EmptyTableSectionTwo from "@/components/EmptyDataSection/EmptyTableSectionTwo";
import CreateShippingCountriesModal from "@/components/Modals/ShippingCountries/CreateShippingCountriesModal";
import CreateShippingSettingModal from "@/components/Modals/ShippingSetting/CreateShippingSettingModal";
import DeleteShippingSettingModal from "@/components/Modals/ShippingSetting/DeleteShippingSettingModal";
import EditShippingSettingModal from "@/components/Modals/ShippingSetting/EditShippingSettingModal";
import OrderSiteStatus from "@/components/Shared/OrderSiteStatus";
import FilterShippingSetting from "@/components/ShippingSetting/FilterShippingSetting";
import SearchShippingSetting from "@/components/ShippingSetting/SearchShippingSetting";
import SortShippingSettingSelect from "@/components/ShippingSetting/SortShippingSettingSelect";
import { useFullStage } from "@/hooks/useFullStage";
import CountryFlag from "@/shared/Country/CountryFlag";
import Loader from "@/shared/Loader/Loader";
import Paginate from "@/shared/Paginate/Paginate";
import Contentlayout from "@/shared/layout-components/layout/content-layout";
import ProductSkeleton from "@/shared/skeleton/ProductSkeleton";
import { isValidArray } from "@/utils/func";
import { getShippingSettings } from "@/utils/instance";
import _ from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  MdOutlineDeleteOutline,
  MdOutlineDriveFileRenameOutline,
} from "react-icons/md";

const ShippingOptionCard = ({
  option,
  setShippingUpdateData,
  setDeleteModalOpen,
  setEditModalOpen,
  setCreateModalOpen,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-2   md:mb-4 rounded-md">
      <h2 className="text-lg font-semibold">Name: {option.name}</h2>
      <p className="text-gray-600 mb-2">Arrival Note: {option.arrivalNote}</p>
      <p className="mb-2">Note For Customer: {option.noteForCustomer}</p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <p>Country: </p>{" "}
        <div style={{ marginLeft: "10px" }} className="flex items-center">
          <CountryFlag country={option?.shippingCountry?.country} />
          <span style={{ marginLeft: "8px" }}>
            {option?.shippingCountry?.country?.label}
          </span>
        </div>
      </div>
      <p className="text-xl font-bold mb-4 mt-4">
        Cost: ${parseFloat(option.cost).toFixed(2)}
      </p>
      <p className="text-sm my-2">Site: {option?.site ?? "N/A"}</p>
      <p className="text-sm my-2">
        isActive: {option?.isActive ? "Active" : "Inactive"}
      </p>
      <div className="flex items-center justify-between">
        <p>
          Free Shipping: {option?.freeShipping?.allow ? "Yes" : "No"} - Subtotal
          ${parseFloat(option?.freeShipping?.amount)?.toFixed(2)}
        </p>
        <div className="flex items-center gap-2">
          <MdOutlineDriveFileRenameOutline
            className="cursor-pointer"
            onClick={() => {
              setShippingUpdateData({
                ...option,
                shippingCountry: {
                  ...(option?.shippingCountry || {}),
                  ...(option?.shippingCountry?.country || {}),
                },
              });
              setEditModalOpen(true);
            }}
          />
          <MdOutlineDeleteOutline
            className="cursor-pointer"
            onClick={() => {
              setShippingUpdateData({
                ...option,
                shippingCountry: {
                  ...(option?.shippingCountry || {}),
                  ...(option?.shippingCountry?.country || {}),
                },
              });
              setDeleteModalOpen(true);
            }}
          />
        </div>
      </div>
    </div>
  );
};

const ShippingOptionsList = ({
  options,
  isRequest,
  setShippingCountriesModalOpen,
  setShippingUpdateData,
  setDeleteModalOpen,
  setEditModalOpen,
  setCreateModalOpen,
}) => {
  return (
    <div className="w-full">
      {isRequest ? (
        <ProductSkeleton count={3} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-2  md:gap-4">
          {isValidArray(options) &&
            options.map((option) => (
              <ShippingOptionCard
                className=""
                key={option._id}
                option={option}
                setShippingUpdateData={setShippingUpdateData}
                setDeleteModalOpen={setDeleteModalOpen}
                setEditModalOpen={setEditModalOpen}
                setCreateModalOpen={setCreateModalOpen}
              />
            ))}
        </div>
      )}

      {options?.length == 0 && (
        <>
          {/* <main id="content" className="mx-auto w-full min-h-screen mt-6">
          <div className="text-center py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="block font-bold text-xl my-2">Search No Result</h1>
            <p>We're sorry. We cannot find any matches for your search term.</p>
          </div>
        </main> */}

          <div className=" w-8/12  lg:w-6/12 mx-auto">
            <EmptyTableSectionTwo />
          </div>
        </>
      )}
    </div>
  );
};

const Shipping = () => {
  const { Settings } = useFullStage();
  const [appInfoSetting, setAppInfoSetting] = Settings.AppInfoSetting;
  const [shippingSettings, setShippingSettings] = useState({});
  const [shippingUpdateData, setShippingUpdateData] = useState({});
  const [isRequest, setIsRequest] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [initPaginate, setInitPaginate] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createShippingCountriesModalOpen, setShippingCountriesModalOpen] =
    useState(false);
  const [updateData, setUpdateData] = useState({});
  const [query, setQuery] = useState({
    site: { label: "All Sites", value: "" },
  });
  const fetchShippingSettings = async () => {
    try {
      setIsRequest(true);
      const res = await getShippingSettings({ page: 1, limit: 10 });
      setIsRequest(false);
      setShippingSettings(res?.data);
    } catch (error) {
      setIsRequest(false);
      //
    }
  };
  const fetchPaginateShippingSettings = async () => {
    try {
      setIsRequest(true);
      const res = await getShippingSettings({
        ...query,
        page: currentPage,
        limit: 10,
      });
      setShippingSettings(res?.data);
      setIsRequest(false);
    } catch (error) {
      setIsRequest(false);
      //
    }
  };
  const fetchShippingSettingsQueries = async (val = {}) => {
    try {
      setIsRequest(true);
      const res = await getShippingSettings({
        ...query,
        ...val,
        page: 1,
        limit: 10,
      });
      setShippingSettings(res?.data);
      setIsRequest(false);
    } catch (error) {
      setIsRequest(false);
      //
    }
  };

  useEffect(() => {
    fetchShippingSettings();
  }, []);

  useMemo(() => {
    if (initPaginate) {
      fetchPaginateShippingSettings();
    }
  }, [currentPage]);

  function handleDebounceFn(val) {
    fetchShippingSettingsQueries(val);
  }

  const debounceFn = useCallback(_.debounce(handleDebounceFn, 1000), []);

  function handleChange(value) {
    const val = { ...query, q: value };
    setQuery(val);
    debounceFn(val);
  }

  const resetHandler = async () => {
    setQuery({});
    await fetchShippingSettings();
    return true;
  };

  const onChangeSiteType = async (site) => {
    setQuery({ ...query, site });

    try {
      fetchShippingSettingsQueries({ ...query, site });
    } catch (error) {
      console.log(error, " error in hammer bell site filter");
    }
  };
  // console.log(shippingUpdateData,'testing click');
  return (
    <Contentlayout>
      <div className="container mx-auto   mt-4  md:mt-8 ">
        <div className="  pb-4  md:pb-8">
          <div className="flex  flex-wrap justify-between items-center gap-4 bg-white py-4 rounded-sm px-4">
            <div className="flex items-center flex-wrap  gap-4  md:gap-6">
              <h1 className="text-xl font-semibold">Shippings</h1>
              <SearchShippingSetting
                onChangeHandler={handleChange}
                query={query}
              />
            </div>
            <div className="flex items-center  justify-between sm:justify-start  flex-wrap gap-4">
              <button
                className=" cursor-pointer bg-blue-500 px-4 py-2 rounded-md flex items-center text-white gap-1 !hidden"
                onClick={() => {
                  setShippingUpdateData({
                    isActive: true,
                    ["freeShipping.allow"]: true,
                  });
                  setShippingCountriesModalOpen(true);
                }}
              >
                <FaPlus /> Shipping Countries
              </button>
              <FilterShippingSetting
                query={query}
                setQuery={setQuery}
                fetchShippingSettingsQueries={fetchShippingSettingsQueries}
                resetHandler={resetHandler}
              />{" "}
              <SortShippingSettingSelect
                query={query}
                setQuery={setQuery}
                fetchShippingSettingsQueries={fetchShippingSettingsQueries}
                resetHandler={resetHandler}
              />
              <OrderSiteStatus
                data={updateData}
                setData={setUpdateData}
                query={query}
                onChanges={onChangeSiteType}
              />{" "}
              <button
                className="cursor-pointer bg-blue-500 px-4 py-2 rounded-md flex items-center text-white gap-1"
                onClick={() => {
                  setShippingUpdateData({
                    isActive: true,
                    ["freeShipping.allow"]: true,
                    site: "hb",
                  });
                  setCreateModalOpen(true);
                }}
              >
                <FaPlus /> Create Option
              </button>{" "}
            </div>
          </div>
        </div>
        {isRequest && (
          // <div className="flex items-center justify-center">
          //   <Loader bg="transparent" />
          // </div>
          <ProductSkeleton count={3} />
        )}
        {!isRequest && (
          <>
            <ShippingOptionsList
              options={shippingSettings?.data}
              isRequest={isRequest}
              setDeleteModalOpen={setDeleteModalOpen}
              setEditModalOpen={setEditModalOpen}
              setShippingUpdateData={setShippingUpdateData}
              setCreateModalOpen={setCreateModalOpen}
              setShippingCountriesModalOpen={setShippingCountriesModalOpen}
            />
            <div className="mt-20">
              <Paginate
                currentPage={currentPage}
                setInitPaginate={setInitPaginate}
                setCurrentPage={setCurrentPage}
                totalPages={shippingSettings?.paginate?.totalPage}
              />
            </div>
          </>
        )}
      </div>
      <DeleteShippingSettingModal
        setIsOpen={setDeleteModalOpen}
        isOpen={deleteModalOpen}
        shippingUpdateData={shippingUpdateData}
        setShippingUpdateData={setShippingUpdateData}
        shippingSettings={shippingSettings}
        setShippingSettings={setShippingSettings}
      />

      <EditShippingSettingModal
        setIsOpen={setEditModalOpen}
        isOpen={editModalOpen}
        shippingUpdateData={shippingUpdateData}
        setShippingUpdateData={setShippingUpdateData}
        shippingSettings={shippingSettings}
        setShippingSettings={setShippingSettings}
      />

      <CreateShippingSettingModal
        setIsOpen={setCreateModalOpen}
        isOpen={createModalOpen}
        shippingUpdateData={shippingUpdateData}
        setShippingUpdateData={setShippingUpdateData}
        shippingSettings={shippingSettings}
        setShippingSettings={setShippingSettings}
      />

      <CreateShippingCountriesModal
        setIsOpen={setShippingCountriesModalOpen}
        isOpen={createShippingCountriesModalOpen}
        shippingUpdateData={shippingUpdateData}
        setShippingUpdateData={setShippingUpdateData}
        shippingSettings={shippingSettings}
        setShippingSettings={setShippingSettings}
      />
    </Contentlayout>
  );
};

export default Shipping;
