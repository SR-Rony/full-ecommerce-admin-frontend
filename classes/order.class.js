export class MailPersonalize {
    constructor(customer = null, order = null) {
        this.customer = customer;
        this.order = order;
    }

    getData() {

        return {
            customer: {
                firstName: { varName: "{{customer.firstName}}", value: this.customer ? this.customer.firstName : null },
                lastName: { varName: "{{customer.lastName}}", value: this.customer ? this.customer.lastName : null }
            },
            order: {
                orderId: { varName: "{{order.orderId}}", value: this.order ? this.order.orderId : null }
            },
            options:[
                {label:"All Active Customers",value:"all_active_customers"},
                {label:" All Inactive Customers",value:"all_inactive_customers"},
                {label:"New Customers (Registered in 7 days)",value:"new_customers_(registered_in_7_days)"},
                {label:"Customers has no orders yet",value:"customers_has_no_orders_yet"},
            ]
        };
    }
    static buildTemplate(body, personalizeData) {
        for (const key in personalizeData) {
            for (const varKey in personalizeData[key]) {
                body.replace(personalizeData[key][varKey].varName, personalizeData[key][varKey].value);
            }
        }
    }
}
