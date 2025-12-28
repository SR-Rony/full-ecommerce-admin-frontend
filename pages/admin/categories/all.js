import CategoriesCreateModal from "@/components/Modals/Categories/CategoriesCreateModal";
import CategoriesDeleteModal from "@/components/Modals/Categories/CategoriesDeleteModal";
import CategoriesEditModal from "@/components/Modals/Categories/CategoriesEditModal";
import CategoriesTransferModal from "@/components/Modals/Categories/CategoriesTransferModal";
import Paginate from "@/shared/Paginate/Paginate";
import Contentlayout from "@/shared/layout-components/layout/content-layout";
import { isValidArray } from "@/utils/func";
import { getCategories, transferToCategories } from "@/utils/instance";
import _ from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BiTransfer } from "react-icons/bi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { RiEditLine } from "react-icons/ri";
import Swal from "sweetalert2";

const CategoriesAll = () => {
  const [oldSlug, setOldSlug] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState("");

  const [updateData, setUpdateData] = useState({});
  const [query, setQuery] = useState({});
  const [categories, setCategories] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [initPaginate, setInitPaginate] = useState(false);
  const [page, setPage] = useState(1);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res?.data);
    } catch (error) {
      setCategories({});
    }
  };

  const fetchCategoriesQueries = async (val) => {
    try {
      const res = await getCategories({ ...query, ...val });
      setCategories(res?.data);
    } catch (error) {
      setCategories({});
    }
  };

  function handleDebounceFn(val) {
    fetchCategoriesQueries(val);
  }

  const debounceFn = useCallback(_.debounce(handleDebounceFn, 1000), []);

  function handleChange(keys, value) {
    const val = { ...query, [keys]: value };
    setQuery(val);
    debounceFn(val);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchPaginate = async () => {
    try {
      const res = await getCategories({ ...query });
      setCategories(res?.data);
    } catch (error) {
      setCategories({});
    }
  };

  useMemo(() => {
    if (initPaginate) {
      fetchPaginate();
    }
  }, [page]);

  const handleClickSetData = (data = {}) => {
    if (data) {
      data["homePage.display"] = data?.homePage?.display || false;
      data["homePage.order"] = data?.homePage?.order || 0;
      data["imageUrl"] = data?.imageUrl || null;
      const searchOptions = isValidArray(categories?.data)
        ? categories.data?.map((item) => {
            return {
              _id: item?._id,
              value: item?._id,
              label: item?.name,
            };
          })
        : [];
      setUpdateData((prev) => {
        return {
          ...prev,
          ...data,
          searchOptions: searchOptions,
        };
      });
      setOldSlug(data?.slug);
    }
  };

  const handleTransferCategories = async () => {
    try {
      if (!updateData?._id) {
        Swal.fire({
          title: "Error!",
          text: "Please Select Categories!",
          icon: "error",
        });
      }
      const data = {};
      data["removeCategoryIds"] = [updateData?._id];

      data["transferCategoryIds"] = isValidArray(updateData?.selectedOptions)
        ? updateData?.selectedOptions.map((item) => item?.value)
        : [];

      data["actionType"] =
        updateData?.actionType === true
          ? "categories_transfer_to_delete_pervious_one"
          : "";

      const res = await transferToCategories(data);
      if (updateData?.actionType === true) {
        setCategories((prev) => {
          const filterData = isValidArray(prev?.data)
            ? prev.data.filter((item) => item?._id !== updateData?._id)
            : [];
          return {
            ...prev,
            data: filterData,
          };
        });
      }
      Swal.fire({
        title: "Success",
        text: res?.data?.message,
        icon: "success",
      });

      setTransferModalOpen(false);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error?.response?.data?.message,
        icon: "error",
      });
    }
  };

  const HandleSelectCategories = (value) => {
    setUpdateData((prev) => {
      return {
        ...prev,
        selectedOptions: value,
      };
    });
  };

  const fetchCategoriesQueriesSearchOptions = async (val) => {
    try {
      if (!val?.q) return "";
      const res = await getCategories(val);
      const searchOptions = isValidArray(res?.data?.data)
        ? res.data.data.map((item) => {
            return {
              _id: item?._id,
              value: item?._id,
              label: item?.name,
            };
          })
        : [];
      setUpdateData((prev) => {
        return {
          ...prev,
          searchOptions: searchOptions,
        };
      });
    } catch (error) {
      setUpdateData((prev) => {
        return {
          ...prev,
          searchOptions: [],
        };
      });
    }
  };
  function handleDebounceFnOptionsSearch(val) {
    fetchCategoriesQueriesSearchOptions(val);
  }

  const debounceFnOptionsSearch = useCallback(
    _.debounce(handleDebounceFnOptionsSearch, 1000),
    []
  );

  function handleTransferCategoriesChange(value) {
    const val = { q: value };
    debounceFnOptionsSearch(val);
  }
  return (
    <Contentlayout>
      <div>
        <div className="container mx-auto py-4 min-h-screen ">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold mb-4">Categories</h1>
            <button
              className=" hover:bg-blue-500 ms-auto py-2 px-4 w-[200px] bg-blue-400 text-white rounded-md block border-gray-200  text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
              onClick={() => {
                setUpdateData({
                  "homePage.display": false,
                  "homePage.order": 0,
                });
                setOldSlug("");
                setCreateModalOpen(true);
              }}
            >
              Create
            </button>
          </div>
          <input
            type="text"
            placeholder="Search categories"
            className="w-full p-2 mb-4 border rounded border-blue-500"
            value={query?.q || ""}
            onChange={(e) => handleChange("q", e.target.value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {isValidArray(categories?.data) &&
              categories?.data?.map((category, index) => (
                <div
                  key={index}
                  className="px-4 py-5 border  hover:bg-gray-50 bg-white rounded-lg duration-200 hover:shadow "
                >
                  <p className="text-center"> {category?.name}</p>

                  <div className="flex items-center gap-2 justify-center pt-4 flex-wrap">
                    <button
                      className="flex items-center gap-1 cursor-pointer bg-cyan-500 text-white px-2 py-1 rounded"
                      onClick={() => {
                        handleClickSetData(category);
                        setTransferModalOpen(true);
                      }}
                    >
                      <BiTransfer size={18} />
                      Transfer
                    </button>{" "}
                    <button
                      className="flex items-center gap-1 cursor-pointer bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => {
                        handleClickSetData(category);
                        setEditModalOpen(true);
                      }}
                    >
                      <RiEditLine size={18} />
                      Edit
                    </button>{" "}
                    <button
                      className="flex items-center gap-1 cursor-pointer bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => {
                        handleClickSetData(category);
                        setDeleteModalOpen(true);
                      }}
                    >
                      <MdOutlineDeleteOutline size={18} /> Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="my-10">
          <Paginate
            setCurrentPage={setPage}
            currentPage={page}
            totalPages={categories?.paginate?.totalPage}
            setInitPaginate={setInitPaginate}
          />
        </div>
      </div>
      {transferModalOpen && (
        <CategoriesTransferModal
          handleTransfer={handleTransferCategories}
          onInputChange={handleTransferCategoriesChange}
          onChange={HandleSelectCategories}
          categories={categories}
          searchOptions={updateData?.searchOptions || []}
          selectedOptions={updateData?.selectedOptions || []}
          setCategories={setCategories}
          isOpen={transferModalOpen}
          setIsOpen={setTransferModalOpen}
          setUpdateData={setUpdateData}
          updateData={updateData}
          oldSlug={oldSlug}
        />
      )}

      {createModalOpen && (
        <CategoriesCreateModal
          categories={categories}
          setCategories={setCategories}
          isOpen={createModalOpen}
          setIsOpen={setCreateModalOpen}
          setUpdateData={setUpdateData}
          updateData={updateData}
          oldSlug={oldSlug}
        />
      )}
      {editModalOpen && (
        <CategoriesEditModal
          categories={categories}
          setCategories={setCategories}
          isOpen={editModalOpen}
          setIsOpen={setEditModalOpen}
          setUpdateData={setUpdateData}
          updateData={updateData}
          oldSlug={oldSlug}
        />
      )}
      {deleteModalOpen && (
        <CategoriesDeleteModal
          categories={categories}
          setCategories={setCategories}
          isOpen={deleteModalOpen}
          setIsOpen={setDeleteModalOpen}
          setUpdateData={setUpdateData}
          updateData={updateData}
          oldSlug={oldSlug}
        />
      )}
    </Contentlayout>
  );
};

export default CategoriesAll;
