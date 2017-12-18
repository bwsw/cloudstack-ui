Overview
===============

CloudStack-UI is a project which purpose is to provide an easy-to-use, light, and user friendly front end interface for the Apache CloudStack virtualization management system. 

Apache CloudStack is a great product which is widely used. But its front end is developed for administrators (from our point of view), not for cloud end users. Some of the interactions are not straightforward and unnatural to an average user and require quite a long time to adapt. Other reasons to develop the UI are connected with lack of functions like virtual machine statistics & charting, sophisticated resource accounting, and application management. 

That's what we are trying to add to Cloudstack-UI. The work is still in progress. But for now we have already covered lots of features that make CloudStack more good-looking, intuitive and convenient.

Project on `GitHub <https://github.com/bwsw/cloudstack-ui>`_.

Join the `CloudStack-UI LinkedIn Group <www.linkedin.com/groups/13540203>`_.

Project History
---------------------------
This page provides some background about the project, describes what CloudStack-UI is, and why it was developed.

At Bitworks Software, we have been running an ACS public cloud for 3 years (actually we still run CS 4.3 cloud in production). And we've found that average users who are familiar with Digital Ocean, Amazon AWS, and other VPS management systems feel uncomfortable with original CloudStack UI and make a lot of operational mistakes. That’s why we've decided to implement a convenient and neat end-user facing UI covering regular activities, which are important for day-to-day VM management.

The project is developed by Bitworks Software (https://bitworks.software/en) Frontend Division within the educational marathon, which has the purpose to incorporate our new team members and show them our standard frontend development workflow.

Implementation Details
-----------------------------
(to correct versions)

Designed compatible with Apache CloudStack 4.9 and hasn't tested for the previous versions of CloudStack.

Powered by Angular and Material 2.

Tested and works fine in next modern browsers:
        
- Google Chrome 60.0.3112.78
- Chromium 60.0.3169.0
- Mozilla Firefox 54.0.1
- Safari 5.1.7
- Internet Explorer 11.483.150630

Documentation
---------------------

The documentation for the project is presented in two parts:

1) User Guide that explains average users how to use the UI when working with CloudStack,
2) Administrator's Guide for managers clarifying how to use, manage and configure the cloud infrastructure.  

We hope the new features we support will be useful for both end users and administrators.
