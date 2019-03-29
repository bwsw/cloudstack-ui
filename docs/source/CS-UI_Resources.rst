.. _Resources:

Resource Limits Management Plugin
========================================

.. contents::

Overview
---------------

We introduced a plugin - *Resource Limits Management* - that allows Domain Administrators to manage resource quotas, and users to request or release account resources in the clouds where billing is based on the requested resource quotas of the account. Now it has become available to a user without contacting an administrator. The business rules for request processing are implemented on the backend and are completely separated from the extension.

The extension uses the backend plugin - `µAPI Gateway <https://bitworks.software/en/products/cloudstack-micro-api-gateway/>`_ - developed by our team to help developers to create extensions for CloudStack using any programming language and make these extensions available via additional CloudStack API endpoints. Additional endpoints are implemented with the *Resource Limits Management* backend component developed on Node. Backend services necessary for the extension work (*uAPI Gateway, Resource Limits Management*) and the decision-making backend component based on the business rule are not accessible under the open licensing.

The plugin is deactivated by default. 

Plugin Deployment
-------------------

The instructions on plugin deployment are presented at the `project wiki-page <https://github.com/bwsw/cloudstack-ui/wiki/Resource-Limits-Management-Plugin>`_.

To enable the Resource Limits Management UI-plugin you will need to:

1. Install and configure the *µAPI Gateway* backend plugin in CloudStack.
2. Deploy the *Resource Limits Management* backend plugin.
3. Enable and configure the *Resource Limits Management* UI extension via the `config.json` file.

Managing Resource Limits via UI
----------------------------------------

Resource limits management by Domain Administrators
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

After the plugin is enabled, Domain Administrator can open "Resource quotas" under the "Accounts" menu. In this section, Administrator can view and set resource quotas. To edit resource quotas Administrator enters desired minimum and maximum values for a resource parameter. 

.. figure:: _static/RLM_Admin.png

[-1] stands for any value, that means a resource parameter with [-1] is unlimited. Such parameters are not available for users to change resource limits.

Administrator sets resource quotas for all accounts in the domain.

Changing resources by users
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

After the plugin is enabled, a user can change resource limits in case of the lack of resources or, alternatively, nonuse of extra resources. To send a request a user goes to the Resource usage panel under the *Virtual Machine* section and clicks «Request resources».

In the appeared modal window, a user can see resource parameters and a slider for each parameter. The scales are limited in accordance with the quotas set by Administrator. A user can move a slider within the quotas to change a resource parameter value. Then click «Request» to change the resource limits.

.. figure:: _static/RLM_User.png

Unlimited resources (set by Administrator as [-1]) are not listed among the resource parameters. That means they are not available for changing.

