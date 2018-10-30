.. _Settings:

Settings
-------------
.. Contents::

In the *Accounts* -> *Settings* section a user can modify the interface by changing settings.

.. figure:: _static/Settings_List.png
   :scale: 80%

Security
~~~~~~~~~~~~~~~~~~
A user can manage the following security settings:

- Change password;
- Set the session timeout interval;
- the "Save VM passwords by default" option.

Change Password
""""""""""""""""""
Here you can change the password provided by your Administrator to the one you like. This will improve the account security.

Enter a new password and re-enter it in the next field to confirm it:

.. figure:: _static/Settings_EditPass.png

Click "UPDATE" to save the new password.

In case you have lost or forgotten your password, contact your Administrator.

Session Timeout
"""""""""""""""""""

Here you can specify the maximum amount of time that an active session can be idle (without user activity) before it automatically closes. The default interval is 30 minutes. 

Set the desired time limit in minutes using the switch button |switch icon| to the right or typing it just into the field. Then click "UPDATE" to save the changes.

.. figure:: _static/Settings_EditTimeout.png

The value is stored in user’s tags.

The maximum allowed value is 300 minutes. Please, note that a long time period of an idle session decreases the account security.

The session timeout can be set in the configuration file. You will find more information in the  `configuration guide <https://github.com/bwsw/cloudstack-ui/blob/master/config-guide.md#session-timeout>`_.

.. _Settings_VMPass:

Save VM passwords by default
"""""""""""""""""""""""""""""""
This checkbox allows saving passwords to VM tags automatically for all created virtual machines requiring passwords.

Tick this option here. The passwords will be saved to VM tags right at the moment VMs are created. You will see a password (if it is required for the VM) is marked as saved in a dialog window after the new VM is deployed:

.. figure:: _static/VMs_Create_Dialogue_SavedPass.png

If this option is not activated, every time when creating a machine the system will ask you to save the password by clicking "SAVE" next to it:

.. figure:: _static/VMs_Create_Dialogue_SavePass.png

Then the system will ask you if you wish to save passwords to VM tags automatically. If you click "Yes", the "Save VM passwords by default" option will be activated in *Settings*. You will find more information about VM creation in the :ref:`Create_VM` section.

API Configuration
~~~~~~~~~~~~~~~~~~~~

In this block of settings you can see and manage the API configurations: regenerate API keys, see the connection URL.

You can see an API key and a Secret key in corresponding fields. You can copy any of them clicking |copy icon| to the right. 

.. figure:: _static/Settings_APIKeys.png

Regenerate the keys by clicking |refresh icon| above the fields. New keys will be generated.

.. figure:: _static/Settings_APIKeysRefresh.png

Below you can view a connection URL which is used to send requests to CloudStack API. All requests are listed in the Apache CloudStack documentation available by the link.

.. figure:: _static/Settings_Links.png

VM preferences
~~~~~~~~~~~~~~~~~~~~~~~~
In this block you may set up the keyboard layout.

Keyboard layout
""""""""""""""""""""
Select a keyboard layout in the drop-down list.

The following options are available:

- Standard US keyboard (default value)
- UK keyboard
- Japanese keyboard
- Simplified Chinese keyboard.

.. figure:: _static/Settings_KeyboardLayout1.png

The selected option will appear in the VNC console kayboard layout parameter when accessing a VM via concole. The selected option is also saved to account tags.

Look and Feel
~~~~~~~~~~~~~~~~~~~~~~
In this block you can adjust the interface look.

Interface Language
"""""""""""""""""""
Select the language of your interface. Currently two options are available in the drop-down list:
Russian and English.

.. figure:: _static/Settings_Lang.png

First Day of Week
"""""""""""""""""""
In this block, you have the opportunity to choose between two types of weeks: Sunday - Saturday or Monday - Sunday. 

From the drop-down list select the day when a week starts: Monday or Sanday.

.. figure:: _static/Settings_DayOfWeek.png

.. The first day of week can be set in the configuration JSON file. You will find more information in the `Config Guide <https://github.com/bwsw/cloudstack-ui/blob/master/config-guide.md>`_. 

Time Format
"""""""""""""
Here you have the opportunity to switch the time format from AM/PM to 24H. You can set it to "Auto" and the time format will be set in correspondence to the interface language: AM/PM if you select English and 24H if you select Russian.

.. figure:: _static/Settings_TimeFormat.png

.. The time format can be set in the configuration JSON file. You will find more information in the `Config Guide <https://github.com/bwsw/cloudstack-ui/blob/master/config-guide.md>`_. 

Theme Color
"""""""""""""""""""
Select a preferred theme color. Currently two options are available: "blue-red" and "indigo-pink". The blue-red one is used by default.

Click the field and select another color if you wish.

.. figure:: _static/Settings_Theme.png

A theme color can be set in the configuration JSON file. You will find more information in the `configuration guide <https://github.com/bwsw/cloudstack-ui/blob/master/config-guide.md#default-theme-name>`_. 

.. |bell icon| image:: _static/bell_icon.png
.. |refresh icon| image:: _static/refresh_icon.png
.. |view icon| image:: _static/view_list_icon.png
.. |view box icon| image:: _static/box_icon.png
.. |view| image:: _static/view_icon.png
.. |actions icon| image:: _static/actions_icon.png
.. |edit icon| image:: _static/edit_icon.png
.. |box icon| image:: _static/box_icon.png
.. |create icon| image:: _static/create_icon.png
.. |copy icon| image:: _static/copy_icon.png
.. |color picker| image:: _static/color-picker_icon.png
.. |adv icon| image:: _static/adv_icon.png
.. |switch icon| image:: _static/switch_icon.png

