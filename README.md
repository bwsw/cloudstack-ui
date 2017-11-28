[![Build Status](https://travis-ci.org/bwsw/cloudstack-ui.svg?branch=master)](https://travis-ci.org/bwsw/cloudstack-ui)

Table of Contents
=================

   * [CloudStack-UI](#cloudstack-ui)
      * [Project Story](#project-story)
      * [Implementation Details](#implementation-details)
      * [Features Supported](#features-supported)
      * [Plugins Supported](#plugins-supported)
      * [Features Yet Unsupported](#features-yet-unsupported)
      * [Current To Do's](#current-to-dos)
      * [Long Term To Do's](#long-term-to-dos)
      * [Far Away To Do's](#far-away-to-dos)
      * [Screenshots and Features descriptions](#screenshots--features-descriptions)
         * [Login view](#login-view)
         * [Virtual machines](#virtual-machines-view)
         * [New virtual machine form](#new-virtual-machine-form)
         * [Resource usage bar](#resource-usage-bar)
         * [Storage](#storage)
         * [Images](#images)
         * [Firewall](#firewall)
         * [Activity log](#activity-log)
         * [Accounts](#accounts)
   * [Documentation](#documentation)
      * [Getting started guide](#getting-started-guide)
      * [Deployment](#deployment)
      * [Configuration Options](#configuration-options)
   * [Project Sponsors](#project-sponsors)
      * [How to Contribute](#how-to-contribute)
      * [License](#license)

# CloudStack-UI

CloudStack-UI is a project whose purpose is to develop an easy-to-use, light, and user friendly frontend interface for the [Apache CloudStack](http://cloudstack.apache.org/) virtualization management system. Apache CloudStack itself is a great product which is used very widely, but its frontend is developed for administrators (from our point of view), not for end cloud users. Some of the interactions are not straightforward and unnatural to an average user and require quite a long time to adapt. Other reasons to develop are connected with a lack of functions like virtual machine statistics & charting, sophisticated resource accounting, and application management. These are in our long-term TODO list.

Join CloudStack-UI LinkedIn [Group](https://www.linkedin.com/groups/13540203)

## Project Story

At [Bitworks Software](https://bitworks.software/), we run an ACS public cloud for 3 years (actually we still run CS 4.3 cloud in production) and we found that average users who are familiar with Digital Ocean, Amazon AWS, and other VPS management systems feel uncomfortable with original CloudStack UI and make a lot of operational mistakes. That’s why we decided to implement a convenient and neat end-user facing UI covering regular activities, which are important for day-to-day VM management.

The project is developed by Bitworks Software Frontend Division within the educational marathon, which has the purpose to incorporate our new team members and show them our standard frontend development instrument.

## Implementation Details

* Designed compatible with [Apache CloudStack](http://cloudstack.apache.org/) 4.10 and has been tested for the previous version of CS (4.9).
* Powered by [Angular](https://angular.io/) and [Material 2](https://material.angular.io/).
* Tested and works fine in next modern browsers
   * Google Chrome 60.0.3112.78
   * Chromium 60.0.3169.0
   * Mozilla Firefox 54.0.1
   * Safari 5.1.7
   * Internet Explorer 11.483.150630

## Features Supported

Actual Changelog can be found [here](https://github.com/bwsw/cloudstack-ui/blob/master/CHANGELOG.md).

Since we designed the product from the perspective of well-known use cases, which are common to our public cloud deployment, we implemented only ones which are 100% required and cover most of use cases. Other deployments may imply other requirements, which is why it’s an open source product.

So, what is supported:

* Basic CloudStack zones with virtual router
* Security groups
* KVM Hypervisor
* Security group templates
* Multiple zones
* CloudStackAccount Domains
* Virtual machine standard operations supported by Apache CloudStack
* Root and Data disks management
* Ad-hoc snapshots for disks
* Affinity groups management
* VM groups
* Localization support
* Frontend Themes, Custom VM colors
* Custom and Fixed service and disk offerings
* Password management
* SSH keys management
* API keys management
* Accounts management
* A lot of small improvements which affect  user experience greatly

## Plugins Supported

**Pulse plugin**

Pulse Plugin is designed for visualization of virtual machines performance statistics. Currently this CloudStack-UI extension is only compatible with ACS clusters that use the KVM hypervisor. With help of sensors that collect virtual machines performance statistics via the Libvirt API and store them in an InfluxDB datastore and RESTful statistics server, CloudStack-UI is able to display CPU, RAM,disk IO and network traffic utilization in the form of convenient visual charts.
Pulse allows users of Apache CloudStack to monitor current and previous operational states of virtual machines. The plugin supports various view scales like minutes, hours, days and enables data overlays to monitor peak and average values.
We consider this plugin very important for the CloudStack ecosystem as currently there is no built-in functionality to track VM operational states, although it is vital for system administrators to successfully operate virtual servers. Read more about Plugin deployment [here](https://github.com/bwsw/cloudstack-ui/wiki/Pulse-Plugin-Deployment). 

**WebShell Plugin**

WebShell is a CloudStack-UI extension designed to perform a clientless SSH connection to a virtual machine. The extension is activated in the CloudStack-UI configuration file and is supported by an additional Docker container. As for the way of WebShell usage, the plugin is similar to NoVNC interface provided by CloudStack. However, WebShell uses the SSH protocol and doesn’t allow VM emergency management.
This feature is not available in basic CloudStack UI and API. Plugin deployment and configuration instructions can be found on [the plug-in page](https://github.com/bwsw/cloudstack-ui/wiki/WebShell-Plugin-Deployment).

## Features Yet Unsupported

We intensively use features like projects in our own CloudStackcloud to manage resources dedicated to project groups, etc. but generic users don’t need them, so we don’t support the following features yet:

* Advanced Zones
* Hypervisors other than KVM have not been tested

## Current To Dos

* Responsive interface for smart devices

## Long Term To Dos

* Plugins
   * Resource utilization stats, traffic, IO stats, CS entities stats a.k.a. Accounting
   * Self registration for public cloud
   * RDP/VNC (guacamole)

## Far Away To Dos
* Plugins
   * Applications a.k.a. Roller (Docker swarm or Ansible, tbd)


## Screenshots & Features Descriptions

#### Login view

The login screen has a nice preloader which can be used to brand it for specific company. By default it shows Apache CloudStack banner. There are three possible ways to use domain (the form presented on the screen like in native UI, default domain in settings or an URL-based scheme).

<a href="https://raw.githubusercontent.com/bwsw/cloudstack-ui/master/screens/loginView.png" target="_blank">![Login screen](./screens/loginView_mini.png)</a>

#### Virtual machines view

This screen was rethought greatly. First of all, we implemented the “one step” approach everywhere, and we also made it work without moving from view to view, like ACS native interface does. Thus, all actions on VM instances are managed from the same screen. Also, the interface allows to view several zones immediately, group virtual machines by zones, by logical groups (e.g. Databases, WWW), and by colors.
We added a feature to brush a virtual machine with a specific color to make it look unique and meaningful to users from a certain perspective.
Also we moved most of VM information to the sidebar, which now has four tabs - General view, Storage (disks, snapshots, and ISO), Network (NICs configuration, Firewall rules) and Tags.
From the system behavior standpoint, we have changed it sometimes, e.g. when the user wants to change service offering for running VM, the interface says that VM will be stopped and started, and it doesn’t make the user do it separately. So we replaced disconnected action sequences with connected ones. The data representation can be changed between the "card" and "table" view. Each section contains a switch and this improvement gives a user an opportunity to work with data in each specific section in a more convenient way.

<a href="https://raw.githubusercontent.com/bwsw/cloudstack-ui/master/screens/VMView1.png" target="_blank">![Virtual Machine View screen 1](./screens/VMView1_mini.png)</a>&nbsp;&nbsp;
<a href="https://raw.githubusercontent.com/bwsw/cloudstack-ui/master/screens/VMView2.png" target="_blank">![Virtual Machine View screen 2](./screens/VMView2_mini.png)</a>&nbsp;&nbsp;
<a href="https://raw.githubusercontent.com/bwsw/cloudstack-ui/master/screens/VMView3.png" target="_blank">![Virtual Machine View screen 3](./screens/VMView3_mini.png)</a>

#### New virtual machine form

We changed a new virtual machine screen a lot. Now it’s a one-step dialog and it allows selecting everything from one screen without additional steps. We believe it’s much better for a regular user than the one who is used with the native UI. It also generates meaningful VM names from usernames like `vm-<username>-<counter>`. Another important thing is that the form checks that a user has a required amount of resources to create the virtual machine immediately and thus it doesn’t allow him launching creation that will fail for sure.
Our team has made a big contribution to the improvement of UX when creating a virtual machine. First of all, a user now has an access to the list of all creation steps. Depending on installation source (ISO or a Template) system allows getting not only login, password and IP of the machine, but also an access to VM interaction interface. Currently supported:
- VNC console,
- WebShell if VM has a csui.vm.auth-mode tag with SSH value. To configure access to VM using WebShell, please refer to [wiki](https://github.com/bwsw/cloudstack-ui/wiki/Tags),
- Access via HTTP if VM has a csui.vm.auth-mode tag with HTTP value. To configure access to VM via HTTP, please refer to [wiki](https://github.com/bwsw/cloudstack-ui/wiki/Tags).

<a href="https://raw.githubusercontent.com/bwsw/cloudstack-ui/master/screens/newVMView.png" target="_blank">![New Virtual Machine View](./screens/newVMView_mini.png)</a>
<a href="https://raw.githubusercontent.com/bwsw/cloudstack-ui/master/screens/newVMView2.png" target="_blank">![New Virtual Machine View](./screens/newVMView2_mini.png)</a>

#### Resource usage bar

We also decided to place resource usage bar on the same virtual machine view screen. It can be collapsed or displayed. A resource usage bar allows switching between "used" and "free" presentations to help users understanding capabilities in a better way. Domain administrators can also choose between Account and Domain view. 

<a href="https://raw.githubusercontent.com/bwsw/cloudstack-ui/master/screens/resourceUsageBar.png" target="_blank">![New Virtual Machine View](./screens/resourceUsageBar_mini.png)</a>

#### Storage

This panel displays existing drives. Root disks are visually distinguished from data disks. In addition, there is an option to display only spare disks, which allows saving user's time in certain cases. Each drive has a detailed sidebar with two tabs (Volume and Snapshots). When a virtual machine is removed, attached drives are automatically removed. Also, we don’t allow the user to create additional disks on a virtual machine creation because it leads to confusion when the virtual machine is created from a template – the user doesn’t realize that they add an “additional” drive and it’s not a root one.

<a href="https://raw.githubusercontent.com/bwsw/cloudstack-ui/master/screens/spareDrivesView.png" target="_blank">![Firewall templates view 2](./screens/spareDrivesView_mini.png)</a>&nbsp;
<a href="https://raw.githubusercontent.com/bwsw/cloudstack-ui/master/screens/spareDrivesView2.png" target="_blank">![Firewall templates view 2](./screens/spareDrivesView2_mini.png)</a>
<a href="https://raw.githubusercontent.com/bwsw/cloudstack-ui/master/screens/spareDrivesView3.png" target="_blank">![Firewall templates view 2](./screens/spareDrivesView3_mini.png)</a>

#### Images

We changed the templates and ISOs view to make it more obvious and neat to use. Also, the user can choose the required OS family to filter out unnecessary images. Also the same concept of single view without moving between screens is applied here. Additional things are displayed in the sidebar.

<a href="https://raw.githubusercontent.com/bwsw/cloudstack-ui/master/screens/templatesISOsView.png" target="_blank">![Templates & ISOs view](./screens/templatesISOsView_mini.png)</a>&nbsp;&nbsp;
<a href="https://raw.githubusercontent.com/bwsw/cloudstack-ui/master/screens/templatesISOsView2.png" target="_blank">![Templates & ISOs view 2](./screens/templatesISOsView2_mini.png)</a>

#### Firewall 

Firewall section includes two views: Firewall templates and Shared security groups.
It is important to understand the concept of Firewall templates. This is a preset of rules that can be system default or developed by the user. Upon VM creation the system creates a new security group for every virtual machine which is initially filled with all the rules from specified presets. Next, when the user changes the rules for a certain virtual machine, they don’t affect other machines.
System administrators can specify default presets during the interface deployment in json configuration file; now we have “TCP Permit All”, “UDP Permit All”, “ICMP Permit All” presets which just pass all the traffic because we would like the user who doesn’t read manuals and doesn’t mention the details to still make his virtual machines accessible.
The second way is to use shared security group - the group that is used by other VMs. Users can manage security group rules in two modes: a "view" mode with filtering by types and protocols and an “edit” mode. Security groups editing is available when switching from "view" mode to "editing" mode. If the group is shared, user is warned that changes will affect other VMs using this group. This behavior allows avoiding undesirable changes for other VMs.

<a href="https://raw.githubusercontent.com/bwsw/cloudstack-ui/master/screens/firewallTemplatesView.png" target="_blank">![Firewall templates view](./screens/firewallTemplatesView_mini.png)</a>&nbsp;&nbsp;
<a href="https://raw.githubusercontent.com/bwsw/cloudstack-ui/master/screens/firewallTemplatesView2.png" target="_blank">![Firewall templates view 2](./screens/firewallTemplatesView2_mini.png)</a>

#### Activity Log

It’s a simplified view for account activities. It lets you choose the date and levels and see all of them. It’s close to the same screen in the ACS native UI, but we believe that the user is interested in the events of specific date and scrolling a huge event log back to find something is not productive. Sometimes the HelpDesk service just wants to show the user that something had happened on a specific date, and thus the interface allows you to find information easier.  

<a href="https://raw.githubusercontent.com/bwsw/cloudstack-ui/master/screens/activityLog.png" target="_blank">![Activity Log screen](./screens/activityLog_mini.png)</a>

#### Accounts

Here domain administrators can manage existing accounts, create new accounts and apply filtering and grouping as in other sections. There is also an access to details sidebar of each account with a possibility of editing settings and resource restrictions. In addition to this, an administrator can apply filtering by accounts in other sections, thus narrowing a context and working with a data that he needs at the moment.

<a href="https://raw.githubusercontent.com/bwsw/cloudstack-ui/master/screens/accounts1.png" target="_blank">![Activity Log screen](./screens/accounts1_mini.png)</a>
<a href="https://raw.githubusercontent.com/bwsw/cloudstack-ui/master/screens/accounts2.png" target="_blank">![Activity Log screen](./screens/accounts2_mini.png)</a>

# Documentation

## Getting started guide

1. Before you start, please, prepare Node development environment. Install Node.js or update your current node.js to latest stable version (We recomend Node.js v6.9.2).
2. Clone the CSUI project from GitHub.
3. Run "npm install" command. This command installs all dependencies, which are used in the project. Also, you may use "yarn" command.
4. Prepare your own proxy-conf.js file and set the API endpoint in this file.

### Main commands

| command | action |
|---------|--------|
|npm test | use this command to execute tests via Karma|
|npm run build| use this command to build the project, the build artifacts will be stored in the dist/ directory|
|npm start| use this command to compile the application, it will be available at URL - "localhost:8080". Run this command with argument '-- --proxy-config proxy-conf.js' |

### Proxy-conf.js file example

<pre>
  {
    context: [
      "/client/api",
    ],
    target: "http://api.endpoint/",
    secure: false
  }
</pre>

## Deployment

### Main UI container

To run docker container use:

```
docker run -d -p 80:80 --name cloudstack-ui \
           -e CLIENT_ENDPOINT=http://cloudstack/client \
           -e BASE_HREF=base_href \
           -v /path/to/config.json:/static/config/config.json \
           bwsw/cloudstack-ui:1.0.7
```

`http://cloudstack/client` - URL of CloudStack client endpoint (e.g. http://host:8080/client)

`base_href` - custom base URL (optional, defaults to "/")

`/path/to/config.json` - path to a custom configuration file named config.json (optional)

Additionally, you can change favicon and Cloudstack logo on login screen and in sidebar:
```
-v /path/to/favicon.ico:/static/img/favicon.ico \
-v /path/to/cloudstack_logo.png:/static/img/cloudstack_logo.png \
-v /path/to/cloudstack_logo_light.png:/static/img/cloudstack_logo_light.png \
-v /path/to/cloudstack_logo_dark.png:/static/img/cloudstack_logo_dark.png
```
where the `favicon.ico` is the favicon, `cloudstack_logo.png` is the logo displayed on login screen and `cloudstack_logo_light.png` and `cloudstack_logo_dark.png` are Cloudstack logos displayed in sidebar with dark and light theme respectively.
### Assisting object cleanup container

Some operations implemented in the UI require "delayed" activities, so we use additional cleaner container that cleans objects marked for the removal.

Download and start [bwsw/cloudstack-ui-cleaner](https://hub.docker.com/r/bwsw/cloudstack-ui-cleaner/) container.

## Configuration Options

You can customize the application by providing your own configuration file ([config.json](https://github.com/bwsw/cloudstack-ui/blob/master/src/config/config.json)).

### Default domain URL

Domain URL used to fill the 'Domain' field in the login form

    "defaultDomain": "domain"

### securityGroupTemplates:

Predefined templates for security groups. You can define your own security groups that will be available for all users by default. Format:

    "securityGroupTemplates": [
        {
          "id": "templateTCP",
          "name": "TCP Permit All",
          "description": "Permits all TPC traffic",
          "preselected": true,
          "ingressRules": [
            {
              "ruleId": "9552c7e9-9421-4a16-8a09-00a6bab4aa5a",
              "protocol": "tcp",
              "startPort": 1,
              "endPort": 65535,
              "CIDR": "0.0.0.0/0"
            }
          ],
          "egressRules": [
            {
              "ruleId": "dcaeefe0-0014-4431-b21d-db2e66f9162d",
              "protocol": "tcp",
              "startPort": 1,
              "endPort": 65535,
              "CIDR": "0.0.0.0/0"
            }
          ]
        },
        {...}
    ]



Parameters:

* id: a unique identifier
* name
* description
* preselected (true or false) - specifies whether network rules from this template will be automatically applied for newly created virtual machines
* ingress and egress rules:
   * ruleId: a unique identifier
   * protocol: either 'tcp', 'udp' or 'icmp'
   * CIDR: subnet mask (e.g. 0.0.0.0/0)
   * For TCP and UDP: startPort and endPort
   * For ICMP: icmpCode and icmpType

### vmColors

The set of colors for virtual machines in hexadecimal format. You can specify any colors you like.

### defaultThemeName

Preferred color theme for the app. Available themes are:
```
"blue-red"
"indigo-pink"

```
Is not specified, blue-red one is used.

### offeringAvailability

In this section you can specify which offerings will be available for which zones. Format:

    offeringAvailability: {
      "filterOfferings": true,
        "zoneId": {
          "diskOfferings": ["offeringId1", "offeringId2"],
          "serviceOfferings": ["offeringId3", "offeringId4"]
        }
    }

If filterOfferings is set to false, all offerings will be available for all zones.

### customOfferingRestrictions

In this sections you can specify limits for custom offerings in the following format:

    "customOfferingRestrictions": {
      "offeringId1": {
        "cpuNumber": {
          "min": number,
          "max": number
        },
        "cpuSpeed": {
          "min": speed_in_mhz,
          "max": speed_in_mhz
        },
        "memory": {
          "min": memory_in_mb,
          "max": memory_in_mb
        }
      }
    }
    
Any of these parameters may be left unspecified, in which case 0 will be used for min and infinity will be used for max.

### sessionTimeout

Number of minutes a user's session should stay active. After this time passes the user is
logged out. 

Defaults to `30` (minutes).

You can set it to `0` to turn this off, although in this case the session is likely to expire on the server side.

### allowReorderingSidebar

A boolean value which allows or forbids a user to reorder links in the main sidebar 

### Extensions
Please check [Wiki](https://github.com/bwsw/cloudstack-ui/wiki/Plugins) for extension configuration options.

## Project Sponsors

The project is currently supported by [Bitworks Software](https://bitworks.software/).

![Bitworks Software](https://raw.githubusercontent.com/bwsw/bwsw.github.io/master/15047882.png)

## How to Contribute

You can contribute to the project development in various ways:

1. Share the information about the project with other people, try to install the UI and share your opinion with us and your colleagues.
2. Propose useful features. Ideas are always welcome. 
3. Deploy it somewhere and inform us about your success story and we will share it in the adopters section.
4. Fix bugs and send us the PR.
5. Implement a feature from the Roadmap or simply make something new.
6. Support and promote the development of specific functions which are important to you and may be shared.
7. Provide testing environment for other deployment schemes. Now we interested in testing the app with
   1. KVM with RBD
   2. Xen with NFS, Local, RBD
   3. Oher browsers and operating systems
7. Hire us for frontend or backend development of custom software development projects. Take a look at our [website](https://bitworks.software/) to know where we can be useful. Take a look at our [presentation](https://www.slideshare.net/secret/BpNGxtaPUfOIqj) to learn more about us.

To contribute, just contact us via e-mail: info@bw-sw.com

## License

It’s released under the Apache 2.0 license.
