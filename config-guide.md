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
          "ingressrule": [
            {
              "ruleid": "9552c7e9-9421-4a16-8a09-00a6bab4aa5a",
              "protocol": "tcp",
              "startport": 1,
              "endport": 65535,
              "cidr": "0.0.0.0/0"
            }
          ],
          "egressrule": [
            {
              "ruleid": "dcaeefe0-0014-4431-b21d-db2e66f9162d",
              "protocol": "tcp",
              "startport": 1,
              "endport": 65535,
              "cidr": "0.0.0.0/0"
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
* ingress and egress rules (ingressrule and egressrule respectively):
   * ruleid: a unique identifier
   * protocol: either 'tcp', 'udp' or 'icmp'
   * cidr: subnet mask (e.g. 0.0.0.0/0)
   * For TCP and UDP: startport and endport
   * For ICMP: icmpcode and icmptype

### Default Security Group Name

Allow you to set a name for Default Firewall group

```
"defaultGroupName": {
  "en": "value",
  "ru": "значение"
```

The default name is `default`.

### VM Colors

The set of colors for virtual machines in hexadecimal format. You can specify any colors you like.
```
 "vmColors": [
    {
      "value": "#F44336"
    }
 ]
```

### Max Root Disk Size 

Allow you to set the max root disk size. 

```
"maxRootDiskSize": 512
```

The default value is `1024` GB.
The minimum value for root disk size is `10` GB.

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

    "offeringAvailability": {
      "filterOfferings": true,
      "zones": {
        "zoneId": {
          "diskOfferings": ["offeringId1", "offeringId2"],
          "serviceOfferings": ["offeringId3", "offeringId4"]
        }
      }
    }

If filterOfferings is set to false, all offerings will be available for all zones.
List of available disk offerings in a Storage creation.
List of Disk Offerings available in a VM creation.

### Custom Compute Offering Restrictions

In this sections you can specify limits for custom compute offerings in the following format:

    "customComputeOfferingRestrictions": [
        {
          "offeringId": "73cdef05-d01f-49ad-8ecb-4f2ffd7d8e26",
          "cpunumber": {
            "min": 2,
            "max": 8
          },
          "cpuspeed": {
            "min": 1000,
            "max": 3000
          },
          "memory": {
            "min": 512,
            "max": 8192
          }
        }
    ]

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
        },
        "serviceOfferings": [
          "so-id1",
          "so-id2"
        ]
       }
    ]
    
Each classes should have a unique id, name, description and list of service offering ids, which belong to this class. Name and description should be localized for used languages.

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

### Disk Offering Parameters
This configuration allows a user to set parameters of Disk Offerings that will be shown in Disk Offerings Table.

For example,
```
"diskOfferingParameters": [
  "displaytext",
  "disksize",
  "created"
  "storagetype",
  "provisioningtype",
  "iscustomized",
  "miniops"
  "maxiops"
]
```
### Template Groups

You can define groups for sorting installation sources (templates and ISOs). 

Template group has a required `id` parameter and an optional translations parameter. If there are no translations defined for the template group, group's ID will be used.

A TemplateGroup looks like 
```
"templateGroups": [
  {
    "id": "id-234", //unique key
    "translations": {
      "ru": "Имя Темплейта", // russian translation
      "en": "Template Name" //english translation
  }
]
```
### Default Service Offering

For custom service offerings there can be predefined offering parameters: number of CPUs, speed of CPU and/or memory. For example,

```
"defaultServiceOfferingConfig": {
   "031a55bb-5d6b-4336-ab93-d5dead28a887": {
	   "offering": "3890f81e-62aa-4a50-971a-f066223d623d",
	   "customOfferingParams": {
	      "cpuNumber": 2,
	      "cpuSpeed": 1000,
	      "memory": 1024
	   }
	}
}
```

### Session Refresh Interval

You can set interval for updating the session (_in seconds_):
```
"sessionRefreshInterval": 60
```

### Offering Compatibility Policy

You can set a type of comparing and ignoring VM tags, when changing service offering from one cluster to service offering from another for VM:
```
"offeringCompatibilityPolicy": {
 "offeringChangePolicy": "exactly-match",
 "offeringChangePolicyIgnoreTags": ["t1"]
}
```

### Configure Sidenav
Allows you to predefine the order and visibility of menu items. The order of the menu items is determined by the order of the elements in the array. The VMS menu item can not be made invisible, the visibility property will be ignored.
For configuration, you must specify all menu items and the "allowReorderingSidebar" parameter must be true.

For example (default values),
```
"allowReorderingSidebar": true,
"configureSidenav": [
    { "id": "VMS", "visible": true },
    { "id": "VOLUMES", "visible": true },
    { "id": "TEMPLATES", "visible": true },
    { "id": "SNAPSHOTS", "visible": true },
    { "id": "SGS", "visible": true },
    { "id": "EVENTS", "visible": true },
    { "id": "SSH", "visible": true },
    { "id": "ACCOUNTS", "visible": true },
    { "id": "SETTINGS", "visible": true }
  ]
```

### Default First Day Of Week
Allows you to predefine the setting of the first day in the app. Possible values: 
- 0 - sunday
- 1 - monday (default)

For example, 
```
"defaultFirstDayOfWeek": 0
```

### Default Interface Language
Allows you to predefine the setting of the app interface language. Possible values: 
- "en" (default)
- "ru"

For example, 
```
"defaultInterfaceLanguage": "en"
```

### Default Time Format
Allows you to predefine the setting of the time format. Possible values:
- "auto" - value depends on the interface language (default)
- "hour12" - 12-hour time
- "hour24" - 24-hour time

For example, 
```
"defaultTimeFormat": "hour24",
```

### Extensions
Please check [Wiki](https://github.com/bwsw/cloudstack-ui/wiki/Plugins) for extension configuration options.
