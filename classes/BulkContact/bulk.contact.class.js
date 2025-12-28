export class MailBulkContact {
    constructor({ customer ="", address ="", order = "" } = {}) {
        this.customer = customer;
        this.address = address;
        this.order = order;
    }

    getData() {

        return {
            customer: {
                firstName: { varName: "{{customer.firstName}}", value: this.customer ? this.customer.firstName : "" },

                lastName: { varName: "{{customer.lastName}}", value: this.customer ? this.customer.lastName : "" },

                email: { varName: "{{customer.email}}", value: this.customer ? this.customer.email : "" },
                _id: { varName: "{{customer._id}}", value: this.customer ? this.customer._id : "" },
            },
            order: {
                orderId: { varName: "{{order.orderId}}", value: this.order ? this.order.orderId : "" }
            },
            address: {
                streetNumber: { varName: "{{address.streetNumber}}", value: this.address ? this.address.streetNumber :"" },

                streetName: { varName: "{{address.streetName}}", value: this.address ? this.address.streetName :"" },

                aptUnit: { varName: "{{address.aptUnit}}", value: this.address ? this.address.aptUnit :"" },

                city: { varName: "{{address.city}}", value: this.address ? this.address.city :"" },

                state: { varName: "{{address.state}}", value: this.address ? this.address.state :"" },

                zipCode: { varName: "{{address.zipCode}}", value: this.address ? this.address.zipCode :"" }
            },
            options:  [
                { label: "Active + Inactive (All)", value: "active_plus_inactive_all" },
                { label: "All Active Customers (Orders within last 75 days)", value: "all_active_customers_(orders_within_last_75_days)" },

                { label: "All Inactive Customers (Orders not within last 75 days)", value: "all_inactive_customers_(orders_not_within_last_75_days)" },

                { label: "New Customers (Registered in 7 days)", value: "new_customers_(registered_in_7_days)" },

                { label: "Customers has no orders yet", value: "customers_has_no_orders_yet" },

                { label: "Customers has no activity last 3 months (No Login)", value: "customers_has_no_activity_last3_months_(no_login)" },

                { label: "Potential customers those contacted (via contact us page)", value: "potential_customers_those_contacted" },
                
                { label: "Send Emails Pending Orders in Past 48hrs", value: "send_emails_pending_orders_in_past_48hrs" },

                { label: "Send Emails Pending Orders in Past 7 days", value: "send_emails_pending_orders_in_past_7_days" },

                { label: "Enter email list (Comma Separated)", value: "enter_email_list_(comma_separated)" },
            ]
        };
    }

    static buildTemplate(body, bulkContactData) {
        let msg = body;
        const variables = {}; // Store unique variables and their values
        // Extract all unique variables from bulkContactData
        for (const key in bulkContactData) {
            for (const varKey in bulkContactData[key]) {
                if (bulkContactData[key][varKey]?.varName) {
                    const varName = bulkContactData[key][varKey].varName;
                    const value = bulkContactData[key][varKey].value || "";
                    variables[varName] = value;
                }
            }
        }
    
        // Replace variables in the message with corresponding values
        for (const varName in variables) {
            const regex = new RegExp(varName, "g");
            msg = msg.replace(regex, variables[varName]);
        }
    
        return msg;
      
    }

}

