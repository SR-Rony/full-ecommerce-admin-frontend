import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import 'quill-image-uploader/dist/quill.imageUploader.min.css';
import { useEffect, useState, useRef } from 'react';
import { uploadToCDN } from '@/utils/func';

// Dynamically import react-quill with no SSR
const QuillEditor = dynamic(() => import('react-quill'), { ssr: false });

const MessageInputBulkContact = ({ value, onChange }) => {
  const [quillModules, setQuillModules] = useState(null);
  const [editorContent, setEditorContent] = useState(value || '');
  const iframeRef = useRef(null);

  useEffect(() => {
    // Ensure this code runs only on the client side
    if (typeof window !== 'undefined') {
      // Import Quill and ImageUploader on the client side
      import('quill').then((Quill) => {
        import('quill-image-uploader').then((ImageUploader) => {
          window.Quill = Quill.default;
          import('quill-resize-image').then((ImageResize) => {
            Quill.default.register('modules/imageUploader', ImageUploader.default);
            Quill.default.register('modules/resize', ImageResize.default);

            setQuillModules({
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link'],
                [{ align: [] }],
                [{ color: [] }],
                ['clean'],
              ],
              resize: {
                locale: {},
              },
              imageUploader: {
                upload: (file) => {
                  return new Promise(async (resolve, reject) => {
                    try {
                      const res = await uploadToCDN([file]);
                      if (Array.isArray(res)) {
                        resolve(res[0]);
                      }
                    } catch (err) {
                      reject(err);
                    }
                  });
                },
              },
            });
          });
        });
      });
    }
  }, []);

  const quillFormats = [
    'header',
    'paragraph',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'image',
    'align',
    'color',
  ];

  const handleEditorChange = (content, delta, source, editor) => {
    setEditorContent(editor.getHTML());
    onChange(editor.getHTML());
  };

  const updateIframeContent = () => {
    if (iframeRef.current) {
      const iframeDocument = iframeRef.current.contentDocument;
      if (iframeDocument) {
        iframeDocument.open();
        iframeDocument.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  background-color: white;
                }
              </style>
            </head>
            <body>
              ${editorContent}
            </body>
          </html>
        `);
        iframeDocument.close();
      }
    }
  };

  useEffect(() => {
    updateIframeContent();
  }, [editorContent]);

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden">
      {quillModules && (
        <QuillEditor
          value={value || ''}
          onChange={handleEditorChange}
          modules={quillModules}
          formats={quillFormats}
          className="w-full h-[70%] bg-white"
        />
      )}
      <div className="w-full h-[400px] bg-gray-100 mt-4">
        <h2 className="text-xl font-bold mb-2">Preview</h2>
        <iframe
          ref={iframeRef}
          className="w-full h-full border-none"
          title="Preview"
        />
      </div>
    </div>
  );
};

export default MessageInputBulkContact;
