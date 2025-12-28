import { MailBulkContact } from '@/classes/BulkContact/bulk.contact.class';
import Select from 'react-select';
const BulkContactOptionSelect = ({ selectedOption,onChange }) => {
    const mailBulkContactState = new MailBulkContact().getData();
    return (
        <div className="w-full relative z-40">
            <Select options={mailBulkContactState.options} value={selectedOption} onChange={onChange} placeholder="Search to select option"/>
        </div>
    );
};

export default BulkContactOptionSelect;
