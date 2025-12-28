import Faq from "@/components/Faq/Faq";
import FaqCreateModal from "@/components/Modals/Faq/FaqCreateModal";
import FaqDeleteModal from "@/components/Modals/Faq/FaqDeleteModal";
import FaqEditModal from "@/components/Modals/Faq/FaqEditModal";
import Contentlayout from "@/shared/layout-components/layout/content-layout";
import { getFaqs } from "@/utils/instance";
// import { initAccordions } from "flowbite";
import { useEffect, useMemo, useState } from "react";
const Faqs = () => {
    const [editorData, setEditorData] = useState({});
    const [updateData,setUpdateData] = useState({});
    const [query,setQuery] = useState({});
    const [faqs, setFaqs] = useState({});
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen,setEditModalOpen] = useState(false);
    const [deleteModalOpen,setDeleteModalOpen,] = useState(false);

    const [initPaginate,setInitPaginate] = useState(false);
    const [faqPage,setFaqPage] = useState(1);
    const fetchFaqs = async () => {
        try {
          const res = await getFaqs();
          setFaqs(res?.data);
        } catch (error) {
          setFaqs({});
        }
      };
    useEffect(() => {

        fetchFaqs();
      },[]);
    
      const fetchFaqsPaginate = async () => {
        try {
          const res = await getFaqs({...query});
          setFaqs(res?.data);
        } catch (error) {
          setFaqs({});
        }
      };
    
      useMemo(() => {
        if (initPaginate) {
          fetchFaqsPaginate();
        }
      }, [faqPage]);

    return (
        <Contentlayout>
            <h1 className="text-3xl font-bold my-4">Frequently Asked Questions</h1>
            <div>
                <button className=" hover:bg-blue-500 ms-auto w-[200px] bg-blue-400 text-white rounded-md  py-2 px-3 block border-gray-200  text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70" onClick={() => {
                  setEditorData({});
                  setCreateModalOpen(true);
                  }}>
                    Create
                </button>
            </div>
            <div className="">
        {/* Accordion start  */}
        <div
          id="accordion-collapse"
          data-accordion="collapse"
          className={`   px-10   max-w-[1390px] mx-auto`}
        >
     <Faq faqs={faqs} setEditorData={setEditorData}editorData={editorData} updateData={updateData} setUpdateData={setUpdateData} setDeleteModalOpen={setDeleteModalOpen}setEditModalOpen={setEditModalOpen}/>
      
        </div>{" "}
      
      </div>
          {createModalOpen&&  <FaqCreateModal faqs={faqs} setFaqs={setFaqs} isOpen={createModalOpen} setIsOpen={setCreateModalOpen} editorData={editorData} setEditorData={setEditorData} setUpdateData={setUpdateData}updateData={updateData}/>}

          {editModalOpen&&  <FaqEditModal faqs={faqs} setFaqs={setFaqs} isOpen={editModalOpen} setIsOpen={setEditModalOpen} editorData={editorData} setEditorData={setEditorData} updateData={updateData} setUpdateData={setUpdateData}/>}

          {deleteModalOpen&&  <FaqDeleteModal faqs={faqs} setFaqs={setFaqs} isOpen={deleteModalOpen} setIsOpen={setDeleteModalOpen} editorData={editorData} setEditorData={setEditorData} updateData={updateData} setUpdateData={setUpdateData}/>}
        </Contentlayout>
    );
};

export default Faqs;
