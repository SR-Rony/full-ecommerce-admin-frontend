// src/components/MyEditor.js

import { useEffect, useRef, useState } from 'react';

const AboutUsEditor = ({ editorData, setEditorData } = {}) => {
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
        // config={{
        //   toolbar: {
        //     items: [
        //       'undo',
        //       '|', 'redo',
        //       'heading', '|',
        //       'fontfamily', 'fontsize', '|',
        //       'alignment', '|',
        //       'fontColor', 'fontBackgroundColor', '|',
        //       'bold', 'italic', 'strikethrough', 'underline', 'subscript', 'superscript', '|',
        //       'link', '|',
        //       'outdent', 'indent', '|',
        //       'bulletedList', 'numberedList', 'todoList', '|',
        //       'code', 'codeBlock', '|',
        //       'insertTable', '|',
        //       'uploadImage', 'blockQuote', '|',
        //       'undo', 'redo'
        //     ],
        //     shouldNotGroupWhenFull: true
        //   }
        // }}
        data={editorData?.content || ""}

        onInit={editor => {
          // You can perform additional initialization here if needed
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          setEditorData((prev) => {
            return {
              ...prev,
              content: data
            };
          });
        }}
      />
    </div>
  ) : (
    <div>Editor loading</div>
  );
};

export default AboutUsEditor;
