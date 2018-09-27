.. _Pulse_Plugin:

Pulse Plugin
======================

.. Contents::

Overview
--------------------

The Pulse plugin is designed for visualization of virtual machines performance statistics. Currently, this CloudStack-UI extension is only compatible with ACS clusters that use the KVM hypervisor. With help of sensors that collect virtual machines performance statistics via the Libvirt API and store them in an InfluxDB datastore and RESTful statistics server, CloudStack-UI is able to display CPU, RAM, disk IO and network traffic utilization in the form of convenient visual charts.

Pulse allows users of Apache CloudStack to monitor current and previous operational states of virtual machines. The plugin supports various view scales like minutes, hours, days and enables data overlays to monitor peak and average values.

We consider this plugin very important for the CloudStack ecosystem as currently there is no built-in functionality to track VM operational states, although it is vital for system administrators to successfully operate virtual servers.

Plugin deployment and configuration Instructions can be found below.

Deployment Instructions
------------------------------

.. note:: The Pulse plugin works only for KVM hypervisor right now.

Please, make sure that you have `cs-pulse-server <https://github.com/bwsw/cs-pulse-server>`_ and `cs-pulse-sensor <https://github.com/bwsw/cs-pulse-sensor>`_ to be able to work with the Pulse plugin.

To enable the Pulse plugin you need:

1. Configure plugin in ``config.json``.
#. Run docker container with a correctly specified ``cs-pulse-server`` endpoint.

Pulse configuration
-----------------------

Please, enable ``pulse`` in the extensions section of the ``config.json``::

 "extensions": {
   ...,
   "pulse": true
 }


Running cloudstack-ui docker container
--------------------------------------------
::

 docker run -d -p 80:80 --name cloudstack-ui \
            ...
            -e PULSE_PLUGIN_ENDPOINT=http://url/to/cs-pulse-server \
            ...
            -v /path/to/config.json:/static/config/config.json \
            bwsw/cloudstack-ui

