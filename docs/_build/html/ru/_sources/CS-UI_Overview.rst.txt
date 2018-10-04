.. Contents::

Overview
===============

CloudStack-UI is a project which purpose is to provide an easy-to-use, light, and user-friendly front-end interface for the Apache CloudStack virtualization management system. 

Apache CloudStack is a great product which is widely used. But its front end is developed for administrators (from our point of view), not for cloud end-users. Some of the interactions are not straightforward and unnatural to an average user and require quite a long time to adapt. Other reasons to develop the UI are connected to the lack of functions like virtual machine statistics & charting, sophisticated resource accounting, and application management. 

That is what we are trying to add to Cloudstack-UI. The work is still in progress. But for now we have already covered lots of features that make CloudStack more good-looking, intuitive and convenient.

Project on `GitHub <https://github.com/bwsw/cloudstack-ui>`_.

Join the `CloudStack-UI LinkedIn Group <www.linkedin.com/groups/13540203>`_.

Project History
---------------------------
This page provides some background about the project, describes what CloudStack-UI is, and why it was developed.

At `Bitworks Software <https://bitworks.software/en>`_, we have been running an ACS public cloud for 3 years (actually we still run CS 4.3 cloud in production). And we have found that average users who are familiar with Digital Ocean, Amazon AWS, and other VPS management systems feel uncomfortable with original CloudStack UI and make a lot of operational mistakes. That is why we have decided to implement a convenient and neat end-user facing UI covering regular activities, which are important for day-to-day VM management.

There are several aims we strived to achieve with the new UI: 

1) The first goal is to make the UI more intuitive in terms of usability, business processes and typical use-cases.

2) As nowadays people move further from desktop PCs and go full mobile, we wanted the UI to have a support for that. Having a full control of your cloud from a smartphone, what could be better?

3) One of the major goals we want to achieve is to build a UI that is possible to support for many years. That’s why we have to use only modern technologies.

4) From the technical perspective we also want the UI to support additional meta-information like descriptions, colors, groups, helpers. All of that is not supported by the native UI and it could be used to add some additional semantics to the entities that user has: like Vms, snapshots and so on.

5) The next key point that we wanted to cover with the new UI is to have some extra features beyond the functionality that CloudStack provides, e.g. DNS management, helpdesk integration, PaaS management, runtime statistics charts and monitoring.

6) And a final goal is to have a community support that could help us to improve the product and provide better user experience for the CloudStack users.

Implementation Details
-----------------------------

Designed compatible with Apache CloudStack 4.10 and has been tested for 4.9.

Powered by Angular and Material 2.

Tested and works fine in next modern browsers:
        
- Google Chrome 60.0.3112.78
- Chromium 60.0.3169.0
- Mozilla Firefox 54.0.1
- Safari 5.1.7
- Internet Explorer 11.483.150630

Documentation
---------------------

The documentation for the project is presented in the :ref:`CS_User_Guide` that explains to average users how to use the UI when working with CloudStack. It also includes explanations on managers' part clarifying how to manage the cloud infrastructure via CloudStack-UI.

We hope the new features we support will be useful for both end-users and administrators.

How to Contribute
-------------------------

CloudStack-UI is an open-source project. It is developed by an open and friendly community. Everybody is welcome to contribute and engage with the community.  We are happy to accept any contribution. You can contribute to the project development in various ways:

1. Share the information about the project with other people, try to install the UI and share your opinion with us and your colleagues.
2. Propose useful features. Ideas are always welcome. 
3. Deploy it somewhere and inform us about your success story and we will share it in the adopters section.
4. Fix bugs and send us the PR.
5. Implement a feature from the Roadmap or simply make something new.
6. Support and promote the development of specific functions which are important to you and may be shared.
7. Provide testing environment for other deployment schemes. Now we interested in testing the app with

   1) KVM with RBD
   2) Xen with NFS, Local, RBD
   3) Oher browsers and operating systems
   
8. Hire us for frontend or backend development of custom software development projects. Take a look at our `website <https://bitworks.software/>`_ to know where we can be useful. Take a look at our `presentation <https://www.slideshare.net/secret/BpNGxtaPUfOIqj>`_ to learn more about us.

To contribute, just contact us via e-mail: info@bw-sw.com

