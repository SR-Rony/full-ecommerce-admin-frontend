import TermsAndConditions from "@/components/MarkEditor/TermsAndConditions";
import Loader from "@/shared/Loader/Loader";

import Contentlayout from "@/shared/layout-components/layout/content-layout";
import { ToastEmitter } from "@/utils/Toast";
import { genSlug } from "@/utils/func";
import { createPage, getPageDetailsPage, getPageSlugCheck, updatePage } from "@/utils/instance";
import _ from 'lodash';
import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";

const TermAndConditions = () => {
    const [editorData, setEditorData] = useState({name:"Terms & Conditions",slug:"terms-and-conditions"});
    const [isSlugRequest, setIsSlugRequest] = useState(false);
    const [saveRequest, setSaveRequest] = useState(false);
    const [isPageRequest, setPageRequest] = useState(false);
    const [oldSlug, setOldSlug] = useState("terms-and-conditions");
    const changeHandler = (key, e) => {
        if (key == 'name') {
            setEditorData({
                ...editorData,
                [key]: e.target.value,
                slug: genSlug(e.target.value)
            });
        } else {
            setEditorData({ ...editorData, [key]: e.target.value });
        }

    };

    function handleDebounceFn(inputValue) {
        setIsSlugRequest(true);
        getPageSlugCheck(inputValue).then((res) => {
            if (res?.data?.success) {
                ToastEmitter('success', res?.data.message);
            } else {
                ToastEmitter('error', res?.data.message);
            }
            setIsSlugRequest(false);
        }).catch(err => {
            setIsSlugRequest(false);
            ToastEmitter('error', err.response?.data?.message);
        });
    }

    const debounceFn = useCallback(_.debounce(handleDebounceFn, 1000), []);

    function handleSlugCheck() {
        if (oldSlug == editorData?.slug) {
            return ToastEmitter('success', "Slug available");
        }
        debounceFn(editorData?.slug);
    };

    const handleCreate = async () => {
        setSaveRequest(true);
        await createPage(editorData).then((res) => {
            setSaveRequest(false);
            if (res?.data?.success) {
                setEditorData(res?.data?.data);
                setOldSlug(res?.data?.data?.slug);
                Swal.fire({
                    title: "Success",
                    text:res?.data?.message,
                    icon: "success"
                  });
              
            } else {
                Swal.fire({
                    title: "Error!",
                    text:res?.data?.message,
                    icon: "error"
                  });
            }

        }).catch(err => {

            setSaveRequest(false);
            Swal.fire({
                title: "Error!",
                text:err.response?.data?.message,
                icon: "error"
              });
        });
        setSaveRequest(false);
    };
    const handleUpdate = async () => {
        setSaveRequest(false);
        await updatePage(oldSlug, editorData).then((res) => {
            setSaveRequest(false);
            if (res?.data?.success) {
                setEditorData(res?.data?.data);
                setOldSlug(res?.data?.data?.slug);
                Swal.fire({
                    title: "Success",
                    text:res?.data?.message,
                    icon: "success"
                  });
            } else {

                  Swal.fire({
                    title: "Error!",
                    text:res?.data?.message,
                    icon: "error"
                  });
            }
            setSaveRequest(false);
        }).catch(err => {
            setSaveRequest(false);
            Swal.fire({
                title: "Error!",
                text:err.response?.data?.message,
                icon: "error"
              });
        });
    };

    const fetchAboutUsPage = async () => {
        setPageRequest(true);
        await getPageDetailsPage(oldSlug).then((res) => {
            setPageRequest(false);
            if (res?.data?.success) {
                setEditorData(({...editorData,...res?.data?.data}));
                setOldSlug(res?.data?.data?.slug);
            }

        }).catch(err => {
            setPageRequest(false);
        });
    };

    const handleCreateLogic = async () => {
        if (!editorData?._id) {
            await handleCreate();
        } else {
            await handleUpdate();
        }
    };
    useEffect(() => {
        fetchAboutUsPage();
    }, []);

    return (
        <Contentlayout>
        <div className="mt-8 mb-20 px-4">
            <h1 className="text-3xl font-bold my-4">Terms & Conditions</h1>

            <div className="my-4">

                <div className="md:flex items-center gap-2">
                    <div className="w-full md:w-[50%]">
                        <label htmlFor="title" className="block text-sm mb-2 dark:text-white capitalize">  <p className="py-2 font-bold text-lg">Name</p></label>
                        <div className="relative">
                            <input type="text" name="name" disabled={true}value={editorData?.name || ""}
                                className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                                required />
                        </div>
                    </div>
                    <div className="w-full md:w-[50%] ">
                       
                            <label htmlFor="slug" className="block text-sm mb-2 dark:text-white capitalize">   <p className="py-2 font-bold text-lg">Slug</p></label>
                            <div className="relative ">
                                <input type="text"  disabled={true}name="slug"  value={editorData?.slug || ""}
                                    className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                                    required />
                            </div>

                    </div>
                </div>
            </div>
            <TermsAndConditions editorData={editorData} setEditorData={setEditorData} />
            <div className="mt-6 flex justify-end gap-4">

                {saveRequest ? <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500  w-[100px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize cursor-not-allowed"

                >
                    <Loader bg="transparent" width={'w-5'} height={'h-5'} />
                </button> : <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 w-[130px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize"
                    onClick={async () => {
                        await handleCreateLogic();

                    }}
                >
                    Save
                </button>}
            </div>
        </div>
    </Contentlayout>
    );
};

export default TermAndConditions;
