import { useEffect, useRef, useState } from 'react';

const BulkContactEditor = ({editorData,setEditorData}={}) => {
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  useEffect(() => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic')
    };
    setEditorLoaded(true);
  }, []);

  return editorLoaded ? (
  <div id="faq">
    <CKEditor
    
    editor={ClassicEditor}
    className="h-[400px]"
    data={editorData?.message ||""}
 
    onInit={editor => {
      // You can perform additional initialization here if needed
    }}
    onChange={(event, editor) => {
      const data = editor.getData();
     setEditorData({...editorData,message:data});
    }}
  />
  </div>
  ) : (
    <div>Editor loading</div>
  );
};

export default BulkContactEditor;
