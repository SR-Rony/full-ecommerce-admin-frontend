import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

const MarkdownEditor = dynamic(
  () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
  { ssr: false }
);

const AppInfoEditor = ({appInfoSetting,setAppInfoSetting,keys,value}={}) => {

  const onChange = (keysP,valueP) =>{
    setAppInfoSetting((prev) =>{
      const warningTexts = prev?.warningTexts||{};
      return {
        ...prev,
        warningTexts:{
          ...warningTexts,
          [keysP]:valueP
        }
      };
    });
  };
 
return <div data-color-mode="light" id="appInfoEditor">
   <style jsx global>{`
        .md-editor-toolbar button[aria-label='Add italic text'],
        .md-editor-toolbar button[aria-label='Add header text'],
        .md-editor-toolbar button[aria-label='Add strike text'],
        .md-editor-toolbar button[aria-label='Add underline text'],
        .md-editor-toolbar button[aria-label='Add quote text'],
        .md-editor-toolbar button[aria-label='Add olist text'],
        .md-editor-toolbar button[aria-label='Add ulist text'],
        .md-editor-toolbar button[aria-label='Add todo List'],
        .md-editor-toolbar button[aria-label='Add image text'],
        .md-editor-toolbar button[aria-label='Insert code'],
        .md-editor-toolbar button[aria-label='Insert Code Block'],
        .md-editor-toolbar button[aria-label='Add link text']{
          display: none;
        }
      `}</style>
   <MarkdownEditor
      value={value||""}
      height="300px"
      theme={"light"}
      enablePreview={true}
    
      onChange={(e, viewUpdate) => {
        onChange(keys,e);
      }}
    />
</div>;
};

export default AppInfoEditor;
