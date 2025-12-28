import MessageInputBulkContact from './MessageInputBulkContact';

const EmailForm = ({onChange:onChanges,value}) => (
  <div className="container mx-auto pb-2">
    <p className="text-normal text-center mb-2">Send email to selected customers.</p>
    <form id="bulkMailForm" className="max-w-md mx-auto">
      <div className="mb-2">
        <div className="flex items-center gap-1">
          <label htmlFor="subject" className="block text-sm font-semibold text-gray-600">Subject:</label>
        </div>
        <input type="text" id="subject" name="subject" required className="mt-1 p-2 block w-full rounded border border-gray-300" />
      </div>
      <div className="mb-2">
        <div className="flex items-center gap-1">
          <label htmlFor="message" className="block text-sm font-semibold text-gray-600">Message:</label>
        </div>
       <MessageInputBulkContact value={value} onChange={onChanges}/>
      </div>
    </form>
  </div>
);

export default EmailForm;
