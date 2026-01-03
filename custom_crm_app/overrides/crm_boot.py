# Override CRM boot to add custom menu items and inject script
import frappe


def apply_crm_boot_override():
    """
    Override CRM's get_boot function to add custom sidebar items.
    This is called before each request via the before_request hook.
    """
    try:
        import crm.www.crm as crm_module

        # Store original function if not already stored
        if not hasattr(crm_module, '_original_get_boot'):
            crm_module._original_get_boot = crm_module.get_boot

            def get_boot_with_custom_menu():
                """Extended boot function that adds custom menu items"""
                boot = crm_module._original_get_boot()

                # Add custom sidebar menu items
                boot["custom_sidebar_items"] = get_custom_sidebar_items()

                # Add flag to indicate custom script should be loaded
                boot["load_custom_crm_scripts"] = True

                return boot

            crm_module.get_boot = get_boot_with_custom_menu

    except ImportError:
        # CRM not installed, skip
        pass


def get_custom_sidebar_items():
    """
    Return list of custom sidebar menu items.
    Add your custom menu items here.
    """
    return [
        {
            "label": "Custom Reports",
            "icon": "bar-chart-3",
            "route": "/app/query-report/CRM Custom Report",
            "is_external": True,
        },
        # Add more menu items as needed:
        # {
        #     "label": "Another Report",
        #     "icon": "file-text",
        #     "route": "/app/query-report/Another Report",
        #     "is_external": True,
        # },
    ]
