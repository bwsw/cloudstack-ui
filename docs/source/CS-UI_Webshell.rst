.. _Webshell_Plugin:

WebShell Plugin
=========================

.. Contents::

In clouds the most commonly used operating systems nowadays are Unix or Linux based operating systems. To control Linux system administrators use standard SSH interface. Most system administrators or cloud users have SSH client installed on their machines.

First of all, it is more interactive, because it allows performing copy&paste operations. It is more performant if you need to work with text.

In addition to the UI inactivity interval, SSH plugin supports its own inactivity timeout so you should not worry leaving SSH opened when you go out for a cup of coffee. In comparison to a VNC console, if you open it in your browser, it will be opened forever.

This plugin is not required, but it is very helpful and easy to install and configure it. There is a docker webshell container that should be deployed. This container is a standalone shell proxy and can be used outside of the CloudStack UI, but there is an option to integrate them, Just specify the WebShell endpoint when you run the UI container. You can also disable the plugin in the UI configuration anytime you want. 

Read more about it below.

Overview
-----------

WebShell is a CloudStack-UI extension designed to perform a clientless SSH connection to a virtual machine. The extension is activated in the CloudStack-UI configuration file and is supported by an additional Docker container. As for the way of WebShell usage, the plugin is similar to NoVNC interface provided by CloudStack. However, WebShell uses the SSH protocol and does not allow VM emergency management.

The need for this extension is determined by the shortcomings of the NoVNC interface, that obstructs its usage for everyday administrative purposes:

- Low interactivity and slow throughput of the terminal interface;
- Lack of possibility to copy/paste text from the user's local machine;
- Missing feature to complete the session by timeout;
- Access to the virtual machine in out-of-band mode, which allows performing a number of insecure operations.

WebShell plugin solves these problems:

- Provides high interactivity, which is especially useful when working with information that contains large amounts of text;
- Allows copying and pasting text from the workstation;
- Enables configuration of the session completion timeout, thereby improving the security of the system;
- Does not provide an access to the VM in out-of-band mode.

In future releases, this plugin will be extended with additional features such as integration with the VM access key store and dashboard for efficient work with many open SSH sessions.

This feature is not available in basic CloudStack UI and API. 

Plugin deployment and configuration instructions can be found below.

Deployment Instructions
------------------------------

To enable `WebShell <https://github.com/bwsw/webshell>`_ CloudStack-UI Plugin it is required to:

1. Run WebShell container in the backend.
#. Enable and configure WebShell plugin in ``config.json``.

Starting WebShell Backend
---------------------------

Please check `Usage <https://github.com/bwsw/webshell#usage>`_ section in the `WebShell <https://github.com/bwsw/webshell>`_ repository.

WebShell configuration
------------------------------

Please configure ``webShell`` in the ``extensions`` section of the ``config.json``::

 "extensions": {
   ...,
   "webShell": true
 }

``webShell.address`` is the address of a WebShell backend. WebShell will not be available unless an address is specified.

Running ``cloudstack-ui`` docker container with WebShell
----------------------------------------------------------------

::

 docker run -d -p 80:80 --name cloudstack-ui \
            ...
            -e WEBSHELL_PLUGIN_ENDPOINT=http://url/to/webshell-server \
            ...
            -v /path/to/config.json:/static/config/config.json \
            bwsw/cloudstack-ui

