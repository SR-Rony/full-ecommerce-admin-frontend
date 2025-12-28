import { getSearchCustomersSelect } from '@/utils/instance';
import debounce from 'lodash.debounce';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Select from 'react-select';

type Customer = {
    _id: string;
    site: string;
    firstName: string;
    lastName: string;
    email: string;
};

type OptionType = {
    value: string;
    label: string;
};

interface MultipleCustomerSelectProps {
    existingCustomerIds?: string[];
    onChange: (selected: OptionType[]) => void;
}

const customerToOption = (customer: Customer): OptionType => ({
    value: customer._id,
    label: `${customer.firstName || '----'} ${customer.lastName || ''} (${customer.email}) | ${(customer?.site || "N/A").toUpperCase()}`,
});

const MultipleCustomerSelect: React.FC<MultipleCustomerSelectProps> = ({
    existingCustomerIds = [],
    onChange,
}) => {
    const [options, setOptions] = useState<OptionType[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
    const [loading, setLoading] = useState(false);

    // ✅ 1. Load existing customer IDs
    const loadInitialCustomers = async (ids: string[]) => {
        if (!ids.length) return;

        setLoading(true);
        try {
            const response = await getSearchCustomersSelect({
                customerIds: ids.join(','),
                limit: 50,
                page: 1,
            });

            const customers = response?.data?.data || [];
            const mappedOptions = customers.map(customerToOption);

            setOptions(mappedOptions);
            setSelectedOptions(mappedOptions);
            onChange(mappedOptions);
        } catch (error) {
            console.error('Initial customer fetch failed:', error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ 2. Search customers by query
    const searchCustomers = async (query: string) => {
        setLoading(true);
        try {
            const response = await getSearchCustomersSelect({
                q: query || "",
                limit: 20,
                page: 1,
            });

            const customers = response?.data?.data || [];
            const mappedOptions = customers.map(customerToOption);
            setOptions(mappedOptions);
        } catch (error) {
            console.error('Customer search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Debounced search
    const debouncedSearch = useMemo(
        () =>
            debounce((inputValue: string) => {
                if (inputValue) {
                    searchCustomers(inputValue);
                }
            }, 500),
        []
    );

    const handleInputChange = useCallback(
        (newValue: string) => {
            const input = newValue.trim();
            if (input) debouncedSearch(input);
            return newValue;
        },
        [debouncedSearch]
    );

    const handleChange = (selected: unknown) => {
        const selectedOpts = selected as OptionType[];
        setSelectedOptions(selectedOpts);
        onChange(selectedOpts);
    };

    // ✅ Initial effect to load by ID only once
    useEffect(() => {
        if (existingCustomerIds?.length) {
            loadInitialCustomers(existingCustomerIds);
        }
    }, []);

    return (
        <Select
            isMulti
            isClearable
            isLoading={loading}
            options={options}
            value={selectedOptions}
            onChange={handleChange}
            placeholder="Search & select customers..."
            closeMenuOnSelect={false}
            onInputChange={handleInputChange}
            filterOption={null} // server-side filtering only
        />
    );
};

export default MultipleCustomerSelect;
