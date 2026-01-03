// Copyright (c) 2024, Jack and contributors
// For license information, please see license.txt

frappe.query_reports["CRM Custom Report"] = {
	filters: [
		{
			fieldname: "status",
			label: __("Status"),
			fieldtype: "Select",
			options: "\nNew\nContacted\nNurture\nQualified\nUnqualified\nJunk",
		},
		{
			fieldname: "lead_owner",
			label: __("Lead Owner"),
			fieldtype: "Link",
			options: "User",
		},
		{
			fieldname: "from_date",
			label: __("From Date"),
			fieldtype: "Date",
			default: frappe.datetime.add_months(frappe.datetime.get_today(), -1),
		},
		{
			fieldname: "to_date",
			label: __("To Date"),
			fieldtype: "Date",
			default: frappe.datetime.get_today(),
		},
	],
};
