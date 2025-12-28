import Select from 'react-select';

export const searchOptions = [
    { value: 'adminName', label: 'Name' },  
    
    { value: 'adminIds', label: 'Admin Id' },
   
    { value: 'email', label: 'Email' },
 
];

const AdminFilterSelect = ({ value, setQuery }) => {
    const onChange = ( e) => {
            setQuery((prev) => {
                return {
                    ...prev,
                    ['selectedSearchInput']: e 
                };
            });
    };

    return (
        <div className="w-[7.2rem]">
            <Select options={searchOptions} value={value} onChange={(e) => onChange( e)} placeholder="Select"/>
        </div>
    );
};

export default AdminFilterSelect;
