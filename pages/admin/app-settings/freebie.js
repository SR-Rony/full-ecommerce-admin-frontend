import { useFullStage } from '@/hooks/useFullStage';
import Loader from '@/shared/Loader/Loader';
import Contentlayout from '@/shared/layout-components/layout/content-layout';
import { updateAppInfoSetting } from '@/utils/instance';
import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Swal from 'sweetalert2';
import 'react-quill/dist/quill.snow.css';

// Define the rich text editor with no SSR
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-gray-100 animate-pulse rounded"></div>,
});

// Custom toolbar options
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['blockquote', 'code-block'],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'indent',
  'link', 'image',
  'color', 'background',
  'align',
  'blockquote', 'code-block'
];

// Custom editor component with react-quill
const RichTextEditor = ({ value, onChange, placeholder }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render the editor on the client side
  if (!mounted) {
    return (
      <div className="h-[300px] bg-gray-100 animate-pulse rounded">
        <div className="h-8 bg-gray-200 mb-2"></div>
        <div className="h-4 bg-gray-200 mb-1 w-5/6"></div>
        <div className="h-4 bg-gray-200 mb-1 w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="rich-text-editor">
      <style jsx global>{`
        .rich-text-editor .ql-container {
          min-height: 200px;
          font-size: 16px;
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
        }
        .rich-text-editor .ql-toolbar {
          background: #f8fafc;
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          border: 1px solid #e2e8f0;
        }
        .rich-text-editor .ql-container {
          border: 1px solid #e2e8f0;
          border-top: none;
        }
        .rich-text-editor .ql-editor {
          min-height: 200px;
        }
      `}</style>
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Enter your content here...'}
      />
    </div>
  );
};

const commonStyle = {
  section_title: "text-xl font-bold text-slate-700",
  label: "block text-slate-500 font-semibold",
  input: "p-2 border rounded-[4px] w-full bg-slate-50 bg-opacity-60",
};

const FreebieSettings = () => {
  const { Settings, isLoading, error } = useFullStage();
  const [appInfoSetting, setAppInfoSetting] = useState(null);
  const [isRequest, setIsRequest] = useState(false);

  // Initialize data
  useEffect(() => {
    if (Settings?.AppInfoSetting) {
      const setting = Settings.AppInfoSetting[0] || {};
      setAppInfoSetting(setting);
    }
  }, [Settings]);

  // Handler for input changes
  const handleInputChange = (field, value) => {
    // Handle nested objects (e.g., freebieInfo.title)
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setAppInfoSetting(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent] || {}),
          [child]: value
        }
      }));
    } else {
      setAppInfoSetting(prev => ({ ...prev, [field]: value }));
    }
  };

  // Save settings
  const handleSave = async () => {
    try {
      setIsRequest(true);
      const res = await updateAppInfoSetting(appInfoSetting._id, {
        freebieInfo: appInfoSetting.freebieInfo || {}
      });
      
      if (res?.data?.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Freebie settings updated successfully',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        throw new Error(res?.data?.message || 'Failed to update settings');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to update settings',
        icon: 'error'
      });
    } finally {
      setIsRequest(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading settings: {error.message}</div>;
  }

  if (!appInfoSetting) {
    return <Loader />;
  }

  return (
    <Contentlayout title="Freebie Settings" subtitle="Manage freebie settings">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className={commonStyle.section_title}>Freebie Settings</h2>
        
        <div className="mt-6 space-y-6">
          <div>
            <label className={commonStyle.label}>Title</label>
            <input
              type="text"
              value={appInfoSetting?.freebieInfo?.title || ''}
              onChange={(e) => handleInputChange('freebieInfo.title', e.target.value)}
              className={commonStyle.input}
              placeholder="Enter freebie title"
            />
          </div>
          
          <div>
            <label className={commonStyle.label}>Description</label>
            <div className="mt-1">
              <RichTextEditor
                value={appInfoSetting?.freebieInfo?.description || ''}
                onChange={(content) => handleInputChange('freebieInfo.description', content)}
                placeholder="Enter freebie description..."
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              disabled={isRequest}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {isRequest ? 'Saving...' : 'Save Changes'}
              {isRequest && <span className="ml-2 animate-spin">↻</span>}
            </button>
          </div>
        </div>
      </div>
    </Contentlayout>
  );
};

export default FreebieSettings;