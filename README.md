# Cloudstack UI
Cloudstack UI is a project which purpose is to develop easy to use, light and user friendly frontend interface for Apache Cloudstack virtualization management system. Cloudstack itself is great product which is used widely but it's frontend is developed for administrators, not for end users. Some of behaviours are not transparent and not natural to average user and require quite long adaptation.

## Project Story

Since we run a Cloudstack managed public cloud for 3 years (actually we run CS 4.3 cloud) we found that average users which are familiar to Digital Ocean, Amazon AWS and other VPS management systems feel uncomfortable with Cloudstack UI and tend to make operational mistakes. That's why we decided to implement cool and neat end-user facing UI which covers regular activities which are important to project administrators.

The project is developed by Bitworks Software Frontend Division during educational marathon which purpose was to incorporate new team members and show them our standard development instruments for frontend development.

## Implementation Details

* Designed compatible with Apache Cloudstack 4.9 and wasn't tested with previous versions of CS
* Powered by Angular 2 and Google Material Design

## Features Supported

Since we designed the product from the perspective of well-known use cases which are common to our public cloud deployment we implemented only ones which are 100% required and covers most of use cases. May be in another deployment there are other requirements, but it's open source product indeed. 

So, what is supported:

* Basic Cloudstack zones with virtual router
* Security groups
* KVM Hypervisor
* Security group templates
* Multiple zones
* Virtual machine standard operations supported by Apache Cloudstack
* Root and Data disks management
* Affinity groups management
* VM groups
* Frontend Themes, Custom VM colors
* Localization support
* Branding support

## Features Unsupported

We intensively use features like projects in our own Cloudstack cloud to manage resources dedicated to project groups, etc. but generic users don't need them, so we don't support next features yet:

* Advanced Zones
* Other hypervisors than KVM are not tested
* Projects
* Domains

## Screenshots

## Project Team


## Project Sponsors

Currently project is supported by [Bitworks Software](https://bitworks.software/).

## How to Contribute

You can contribute to development of the project in various ways:

1. Share the information about the project with other people, try to install the UI and share your opinion with Us and your fellows.
2. Propose useful feature which makes life of user easier and more straightforward. Ideas are always welcome. 
3. Deploy it somewhere and inform us about success story and we will share it in adopters section.
4. Fix bugs and send us PR.
5. Implement a feature from Roadmap or just do something which is new.
6. Support and promote the development of specific functions which are important to you and may be shared.
7. Hire us for frontend or backend development for a custom software development projects. Take a look at our [website](https://bitworks.software/) to know where we can be useful. Take a loot at our presentation to know more about us.

To do a contribution, just contact us with next e-mail: info@bw-sw.com

## License

It's released under Apache 2.0 license.

# Documentation

## Deployment

## Configuration Options

