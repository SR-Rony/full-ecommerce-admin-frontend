import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

const MarkdownEditor = dynamic(
  () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
  { ssr: false }
);

const FaqEditor = ({editorData,setEditorData,updateData,setUpdateData}={}) => {

  const onChange = (value) =>{

    // console.log(value );
    setEditorData({...editorData,answer:value});
    if(setUpdateData){
      setUpdateData({...editorData,answer:value});
    }
  };
 
return <div data-color-mode="light">
   <MarkdownEditor
      value={editorData.answer||""}
      height="300px"
      theme={"light"}
      enablePreview={true}
      
      onChange={(value, viewUpdate) => {
      
        onChange(value);
      }}
    />
</div>;
};

export default FaqEditor;
