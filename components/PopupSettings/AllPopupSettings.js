import { useFullStage } from "@/hooks/useFullStage";
import Loader from "@/shared/Loader/Loader";
import Paginate from "@/shared/Paginate/Paginate";
import { ToastEmitter } from "@/utils/Toast";
import { FeaturedImageOutput, isValidArray } from "@/utils/func";
import { getPopups, updatePopup } from "@/utils/instance";
import _ from 'lodash';
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { RiEditLine } from "react-icons/ri";
import PopupCreateModal from "../Modals/PopupSettings/PopupCreateModal";
import PopupDelete from "../Modals/PopupSettings/PopupDelete";
import PopupEditModal from "../Modals/PopupSettings/PopupEditModal";
import PopupFeaturedPhotoUpdateModal from "../Modals/PopupSettings/PopupFeaturedPhotoUpdateModal";
import FilterPopup from "./FilterPopup";
import SearchPopup from "./SearchPopup";
import SortPopupSelect from "./SortPopupSelect";
const AllPopupSettings = (params = {}) => {
const router = useRouter();
  const { q, categories, isBundle, isActive } = params;
  const { Popup } = useFullStage();
  const [popups, setPopups] = Popup.Popups;
  const [singlePopupDetails, setSinglePopupDetails] = Popup.PopupSingleDetails;
  const [popupPage, setPopupPage, popupLimit, setPopupLimit] = Popup.PopupPaginate;
  
  const [isRequestProduct, setIsRequestProduct] = useState(false);
  const [initPaginate, setInitPaginate] = useState(false);
  const [isSlugRequest, setIsSlugRequest] = useState(false);

  const [isRequestPopup, setIsRequestPopup] = useState(false);
  const [popupCreateModalOpen, setPopupCreateModalOpen] = useState(false);
  const [popupEditModalOpen, setPopupEditModalOpen] = useState(false);
  const [popupDeleteModalOpen, setPopupDeleteModalOpen] = useState(false);
  const [popupFeaturedPhotoUpdateModalOpen, setPopupFeaturedPhotoUpdateModalOpen] = useState(false);
  const [query, setQuery] = useState({});

  useEffect(() => {
    if (params && Object.values(params).length) {
      setQuery({
        ...params,
        ...query
      });
    }
  }, [params]);

  const fetchPopups = async () => {
    try {
      setIsRequestPopup(true);
      const queryFilter = { q: q ?? "", page: 1, limit: popupLimit, isActive: isActive ?? "", categories: categories ?? "" };
      const res = await getPopups(queryFilter);
      setIsRequestPopup(false);

      setPopups(res.data);

    } catch (error) {
      setIsRequestPopup(false);
      /* empty */
    }
  };

  const fetchPopupsQueries = async (val) => {
    try {
      setIsRequestPopup(true);
      const res = await getPopups(val);
      setIsRequestPopup(false);
      setPopups(res.data);
      return true;
    } catch (error) {
      setIsRequestPopup(false);
      return false;
      /* empty */
    }
  };

  const fetchPaginatePopups = async () => {
    try {
      setIsRequestPopup(true);
      const queryFilter = { q: query?.q ?? "", page: popupPage || 1, limit: popupLimit, isActive: query?.isActive ?? "", categories: query?.categories ?? "", isBundle: query?.isBundle ?? "" };
      const res = await getPopups(queryFilter);
      setIsRequestPopup(false);
      setPopups(res.data);

    } catch (error) {
      setIsRequestPopup(false);
      /* empty */
    }
  };

  useMemo(() => {
    if (initPaginate) {
      fetchPaginatePopups();
    }
  }, [popupPage]);

  const handleFileSave = async () => {
    try {
      const res = await updatePopup({ data: { images: singlePopupDetails?.images }, slug:singlePopupDetails?.oldSlug || singlePopupDetails?.slug });
      if (res.data.success) {
        setSinglePopupDetails((prev) => {
          return {
            ...prev,
            images: res?.data?.data?.images
          };
        });
        ToastEmitter('success', 'Popup Images update successfully!');
        return true;
      } else {
        ToastEmitter('success', 'Popup Images update failed!');
        return false;
      }
    } catch (error) {
      return false;
      // 
    }
  };

  useEffect(() => {
    fetchPopups();
    setInitPaginate(true);
  }, [q, categories, isBundle, isActive]);

  function handleDebounceFn(val) {
    fetchPopupsQueries(val);
  }

  const debounceFn = useCallback(_.debounce(handleDebounceFn, 1000), []);

  function handleChange(keys, value) {
    const val = { ...query, [keys]: value };
    setQuery(val);
    debounceFn(val);
  };
  const resetHandler = async () => {
    setQuery({});
    await fetchPopups();
    return true;
  };

  const optionsGen = (arr) => {
    return isValidArray(arr) && arr.length > 0 ? arr.map(itm => {
      return {
        id: itm?._id,
        label: itm?.title || itm?.name,
        value: itm?.slug
      };
    }) : [];
  };

  const handleSingleClick =(popup) =>{
    popup['oldSlug'] = popup?.oldSlug||popup?.slug;
    popup['selectedProductsOptions'] = optionsGen(popup?.products);
    popup['selectedCategoriesOptions'] = optionsGen(popup?.categories);
    setSinglePopupDetails(popup);
  };
  return (
    <div>
      <div className="col-span-12 xxl:col-span-6">
        <div className="box">
          <div className="box-header">
            <div className="flex  flex-wrap justify-between">
              <div className="flex  flex-wrap  items-center gap-4">
                <h5 className="box-title my-auto">Popups</h5>
                <SearchPopup keys="q" onChangeHandler={handleChange} query={query} />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div>

                  <FilterPopup setQuery={setQuery} query={query} resetHandler={resetHandler} fetchPopupsQueries={fetchPopupsQueries} />

                </div> |
                <div>
                  <SortPopupSelect setQuery={setQuery} query={query} resetHandler={resetHandler} fetchPopupsQueries={fetchPopupsQueries} />
                </div> |
                <button className="flex items-center gap-1 cursor-pointer" onClick={() => {
                  setSinglePopupDetails({isActive:true});
                  setPopupCreateModalOpen(true);
                }}>
                  <FaPlus size={14} /> Add new popup
                </button>
              </div>
            </div>
          </div>
          <div className="box-body min-h-screen">
            {isRequestPopup && <div className="mx-auto pb-4">
              <Loader />
            </div>}
            {
              isValidArray(popups?.data) ? <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-col">
                {
                  !isRequestPopup && isValidArray(popups?.data) && popups.data.map((popup, i) => (

                    <li className="mb-6 border rounded-sm" key={i} onClick={() => {
                      handleSingleClick(popup);
                    }}>
                      <Link href={`/admin/app-settings/popups/details/${popup?.slug}`} className="p-4 block text-sm font-semibold  bg-slate-100">{popup?.title}</Link>
                      <div className="!rounded-sm  text-gray-800 dark:text-white w-full p-4">
                        <div className="sm:flex items-center w-full">
                          <Link href={`/admin/app-settings/popups/details/${popup?.slug}`} className="ltr:pr-4 rtl:pl-4 inline-block relative">
                            <img src={FeaturedImageOutput(popup?.images)} alt="img" className="avatar w-28 h-28 rounded-sm" />
                            {popup?.isSoldOut === false && (
                              <>
                                {popup?.bundle?.isLimited === true ? (
                                  <img
                                    width={200}
                                    height={200}
                                    alt="Bundle"
                                    src="/limited_0b.undle.7be79f82.png"
                                    className="absolute  -top-[50px] -left-[38px]"
                                  />
                                ) : (
                                  <img
                                    width={50}
                                    height={50}
                                    alt="Sale"
                                    src={"/salephoto.webp"}
                                    className="absolute -top-[30px] -left-[16px] "
                                  />
                                )}
                              </>
                            )}
                          </Link>

                          <div className="mt-2 sm:mt-0 flex-1 font-semibold">

                          <div className="flex items-center  pb-1 cursor-pointer"title={isValidArray(popup?.categories) && popup?.categories.map((category, i) => (
                               `${category?.name}`
                                ))}>
                              <i
                                className="ri-price-tag-3-line text-sm"></i> &nbsp;{item?.product?.categories?.length||0}
                            </div>
                            <div>

                              <p className="text-xs my-1 dark:text-white ">
                                <strong> Description: </strong>
                                {popup?.details?.description && popup?.details?.description.slice(0, 120)}
                              </p>
                              <p className="text-xs my-1 dark:text-white ">
                                <strong> Keywords Count: </strong>
                                {popup?.seo?.keywords && popup?.seo?.keywords.length}
                              </p>
                              <p className="text-xs my-1 dark:text-white ">
                                <strong> Products Count: </strong>
                                {popup?.products && popup?.products.length}
                              </p>

                            </div>

                            <div className="flex items-center gap-2 justify-end pt-3">

                              <button className="flex items-center gap-1 cursor-pointer" onClick={() => {
                                handleSingleClick(popup);
                                setPopupEditModalOpen(true);
                              }}><RiEditLine size={18} />
                                Edit</button> |
                              <button className="flex items-center gap-1 cursor-pointer" onClick={() => {
                               handleSingleClick(popup);
                              setPopupDeleteModalOpen(true);
                              }}><MdOutlineDeleteOutline size={18} /> Delete</button>
                            </div>
                          </div>
                        </div>
                      </div>

                    </li>
                  ))}

              </ul> :
                !isRequestPopup && <>
                  <main id="content" className="mx-auto w-full min-h-screen mt-6">
                    <div className="text-center py-10 px-4 sm:px-6 lg:px-8">
                      <h1 className="block font-bold text-xl my-2">Search No Result</h1>
                      <p>We're sorry. We cannot find any matches for your search term.</p>

                    </div>
                  </main>

                </>

            }
            <div className="flex items-center justify-center gap-4">
              {!isRequestPopup && <Paginate setInitPaginate={setInitPaginate} currentPage={popupPage} setCurrentPage={setPopupPage} totalPages={popups?.paginate?.totalPage || 0} />}
            </div>
          </div>
        </div>
      </div>
      <PopupCreateModal  isOpen={popupCreateModalOpen} setIsOpen={setPopupCreateModalOpen} type="Create" />

      <PopupFeaturedPhotoUpdateModal handleFileSave={handleFileSave}  isOpen={popupFeaturedPhotoUpdateModalOpen} setIsOpen={setPopupFeaturedPhotoUpdateModalOpen} />

      {
       singlePopupDetails?._id&& <>
      <PopupEditModal  isOpen={popupEditModalOpen} setIsOpen={setPopupEditModalOpen} type="Update" />
      <PopupDelete  isOpen={popupDeleteModalOpen} setIsOpen={setPopupDeleteModalOpen} type="delete" /></>
      }
    </div>
  );
};

export default AllPopupSettings;
