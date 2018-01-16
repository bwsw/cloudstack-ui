Config Guide
============

### Default domain URL

Domain URL used to fill the 'Domain' field in the login form

    "defaultDomain": "domain"

### Security Group Templates

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

### VM Colors

The set of colors for virtual machines in hexadecimal format. You can specify any colors you like.
```
 "vmColors": [
    {
      "value": "#F44336"
    }
 ]
```
### Default Theme Name

Preferred color theme for the app. Available themes are:
```
"blue-red"
"indigo-pink"
```
Is not specified, blue-red one is used.
```
 "defaultThemeName": "blue-red"
```
### Offering Availability

In this section you can specify which offerings will be available for which zones. Format:

    offeringAvailability: {
      "filterOfferings": true,
        "zoneId": {
          "diskOfferings": ["offeringId1", "offeringId2"],
          "serviceOfferings": ["offeringId3", "offeringId4"]
        }
    }

If filterOfferings is set to false, all offerings will be available for all zones.

### Custom Offering Restrictions

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

### Service Offering Classes

In this section you can specify classes for service offerings in the following format:

    "serviceOfferingClasses": [
      {
        "id": "class_id",
        "name": {
           "ru": "class_name_ru",
           "en": "class_name_en"
        },
        "description": {
          "ru": "class_description_ru",
          "en": "class_description_en"
        }
       }
    ]
    
Each classes should have a unique id, name, and description. Name and description should be localized for used languages.

### Session Timeout

Number of minutes a user's session should stay active. After this time passes the user is
logged out. 

Defaults to `30` (minutes).

You can set it to `0` to turn this off, although in this case the session is likely to expire on the server side.
```
 "sessionTimeout": 30
```
### Allow Reordering Sidebar

A boolean value which allows or forbids a user to reorder links in the main sidebar. 
```
 "allowReorderingSidebar": false
```
### Extensions
Please check [Wiki](https://github.com/bwsw/cloudstack-ui/wiki/Plugins) for extension configuration options.
