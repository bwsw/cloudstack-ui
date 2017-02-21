# Cloudstack UI
Cloudstack itself is great product which is used widely but it's frontend is developed for administrators, not for end users. Some of behaviours are not transparent and not natural to average user and require quite long adaptation.

## Project Story

Since we run a Cloudstack managed public cloud for 3 years (actually we run CS 4.3 cloud) we found that average users which are familiar to Digital Ocean, Amazon AWS and other VPS management systems feel uncomfortable with Cloudstack UI and tend to make operational mistakes. That's why we decided to implement cool and neat end-user facing UI which covers regular activities which are important to project administrators.

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

Currently proj

## How to Contribute

## License

# Documentation

## Deployment

## Configuration Options

