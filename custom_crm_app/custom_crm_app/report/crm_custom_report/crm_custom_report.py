# Copyright (c) 2024, Jack and contributors
# For license information, please see license.txt

import frappe
from frappe import _


def execute(filters=None):
    columns = get_columns()
    data = get_data(filters)
    return columns, data


def get_columns():
    return [
        {
            "label": _("Lead Name"),
            "fieldname": "lead_name",
            "fieldtype": "Link",
            "options": "CRM Lead",
            "width": 200,
        },
        {
            "label": _("Organization"),
            "fieldname": "organization",
            "fieldtype": "Link",
            "options": "CRM Organization",
            "width": 180,
        },
        {
            "label": _("Status"),
            "fieldname": "status",
            "fieldtype": "Data",
            "width": 120,
        },
        {
            "label": _("Lead Owner"),
            "fieldname": "lead_owner",
            "fieldtype": "Link",
            "options": "User",
            "width": 150,
        },
        {
            "label": _("Source"),
            "fieldname": "source",
            "fieldtype": "Data",
            "width": 120,
        },
        {
            "label": _("Created On"),
            "fieldname": "creation",
            "fieldtype": "Datetime",
            "width": 150,
        },
        {
            "label": _("Email"),
            "fieldname": "email",
            "fieldtype": "Data",
            "width": 180,
        },
        {
            "label": _("Mobile No"),
            "fieldname": "mobile_no",
            "fieldtype": "Data",
            "width": 130,
        },
    ]


def get_data(filters):
    conditions = get_conditions(filters)

    data = frappe.db.sql(
        """
        SELECT
            name as lead_name,
            organization,
            status,
            lead_owner,
            source,
            creation,
            email,
            mobile_no
        FROM
            `tabCRM Lead`
        WHERE
            docstatus < 2
            {conditions}
        ORDER BY
            creation DESC
        """.format(conditions=conditions),
        filters,
        as_dict=1,
    )

    return data


def get_conditions(filters):
    conditions = ""

    if filters.get("status"):
        conditions += " AND status = %(status)s"

    if filters.get("lead_owner"):
        conditions += " AND lead_owner = %(lead_owner)s"

    if filters.get("from_date"):
        conditions += " AND DATE(creation) >= %(from_date)s"

    if filters.get("to_date"):
        conditions += " AND DATE(creation) <= %(to_date)s"

    return conditions
