#Config Guide

See the [config-example.json](https://github.com/bwsw/cloudstack-ui/blob/master/src/config/config-example.json) of a config.json

## General

### Default domain
Default domain used to fill the 'Domain' field in the login form. The default value is an empty value.

For example,
```
"defaultDomain": "domain"
```

### Session Refresh Interval
The session refresh interval sends a request to the server at the specified interval (_in seconds_) to maintain an active session.
The default value is `60`.

For example,
```
"sessionRefreshInterval": 60
```

### API Doc Link
URL address to the API documentation. This address is displayed in the settings section.
The default value is a link to the Apache Cloudstack API.

For example,
```
"apiDocLink": "https://cloudstack.apache.org/api/apidocs-4.11/"
```

### Extensions
Allows you to enable plugins. By default, all plugins are disabled.

For example,
```
"extensions": {
  "webShell": true,
  "pulse": false
}
```

Please check [Wiki](https://github.com/bwsw/cloudstack-ui/wiki/Plugins) for full extension configuration.

## Virtual machines settings

### VM Colors
Allows you to predefine a set of colors for virtual machines in hexadecimal format. You can specify any colors you like.

For example,
```
"vmColors": [
  { "value": "#F44336" },
  { "value": "#E91E63" },
  { "value": "#9C27B0" },
  { "value": "#673AB7" },
  { "value": "#3F51B5" }
]
```

## Firewall (Security groups) settings

### Security Group Templates
Predefined templates for security groups. You can define your own security groups that will be available for all users by default. 

By default, there are no predefined templates.

For example,
```
"securityGroupTemplates": [
  {
    "id": "templateTCP",
    "name": "TCP Permit All",
    "description": "Permits all TPC traffic",
    "preselected": false,
    "ingressrule": [
      {
        "ruleid": "templateTCP-rule-ingress",
        "protocol": "tcp",
        "startport": 1,
        "endport": 65535,
        "cidr": "0.0.0.0/0"
      }
    ],
    "egressrule": [
      {
        "ruleid": "templateTCP-rule-egress",
        "protocol": "tcp",
        "startport": 1,
        "endport": 65535,
        "cidr": "0.0.0.0/0"
      }
    ]
  },
  {
    "id": "templateICMP",
    "name": "ICMP Permit Egress",
    "description": "Permits all egress ICMP traffic",
    "preselected": true,
    "ingressrule": [],
    "egressrule": [
      {
        "ruleid": "templateICMP-rule-egress",
        "icmpcode": -1,
        "icmptype": -1,
        "protocol": "icmp",
        "cidr": "0.0.0.0/0"
      }
    ]
  }
]
```

Parameters:

* id
* name
* description
* preselected (true or false) - specifies whether network rules from this template will be automatically selected in the VM creation form
* ingress and egress rules (ingressrule and egressrule respectively):
   * ruleid: a unique identifier
   * protocol: either 'tcp', 'udp' or 'icmp'
   * cidr: subnet mask (e.g. 0.0.0.0/0)
   * For TCP and UDP: startport and endport
   * For ICMP: icmpcode and icmptype


## Images settings

### Image Groups
You can define groups for sorting installation sources (templates and ISOs). 

Image group has a required `id` parameter and an optional `translations` parameter. If there are no translations defined for the template group, group's ID will be used.

By default, there are no predefined image groups.

For example,
```
"imageGroups": [
  {
    "id": "id-234",
    "translations": {
      "ru": "Имя группы",
      "en": "Group Name"
    }
  }
]
```

## User app settings

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
"defaultTimeFormat": "hour24"
```

### Default Theme Name
Allows you to predefine the setting of the theme. Available themes are:
- "blue-red" (default)
- "indigo-pink"

For example,
```
"defaultThemeName": "blue-red"
```

### Session Timeout
Allows you to predefine the setting of the session timeout. This setting determines the number of minutes a user's session should stay active. After this time passes the user is
logged out. 
You can set it to `0` to turn this off, although in this case the session is likely to expire on the server side.

The default value is `30`.

For example,
```
"sessionTimeout": 30
```

## Menu settings

### Allow Reordering Sidebar
A boolean value which allows or forbids a user to reorder links in the main sidebar. 
```
 "allowReorderingSidebar": false
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

## Service offering setting

### Custom Compute Offering Restrictions
Allows you to specify limits for custom compute offerings hardware parameters for VM creation.
By default, all compute offerings have a minimum restrictions of 1 CPU number, 1000 CPU speed, 512 memory and the maximum values are not limited. 

For example,
```
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
```

### Default Compute Offering
Allows you to specify compute offering that will be automatically preselected in the VM creation form for each zone.
For custom service offerings there can be predefined offering parameters: number of CPUs, speed of CPU and/or memory. 

For example,
```
"defaultComputeOffering": {
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

### Offering Compatibility Policy
Offering Compatibility Policy restrict compute offering change based on the compute offering host tags.

This is very useful when you have several clusters in one zone and you want to protect a user from converting
offerings between incompatible states because it might happen that selected offering is not supported in the cluster where storage of
current VM relates to.

Available change policies:
- "contains-all" - exact tags match
- "exactly-match" -  old offering tags are subset new offering tags
- "no-restrictions" (default)

You can ignore tags that don't influence compatibility with `offeringChangePolicyIgnoreTags` property.

```
"offeringCompatibilityPolicy": {
 "offeringChangePolicy": "exactly-match",
 "offeringChangePolicyIgnoreTags": ["t1"]
}
```

### Compute Offering Classes
Allows you to group compute offerings into the classes while choosing a compute offering for new VM.

By default, there are no predefined compute offering classes.

For example,
```
"computeOfferingClasses": [
    {
      "id": "classId-1",
      "name": {
        "ru": "Имя класса - 1",
        "en": "Class name - 1"
      },
      "description": {
        "ru": "Описание класса - 1",
        "en": "Class description - 1"
      },
      "computeOfferings": [
        "9c81af12-f15b-41f0-9dec-2a837e1dec29"
      ]
    },
    {
      "id": "classId-2",
      "name": {
        "ru": "Имя класса - 2",
        "en": "Class name - 2"
      },
      "description": {
        "ru": "Описание класса - 2",
        "en": "Class description - 2"
      },
      "computeOfferings": [
        "9c81af12-f15b-41f0-9dec-2a837e1dec29"
      ]
    }
  ]
```
    
### Disk Offering Parameters
Allows you to add additional parameters of disk offerings that will be shown in disk offerings table.

Available parameters:
- "displaytext"
- "disksize"
- "created"
- "storagetype"
- "provisioningtype"
- "iscustomized"
- "miniops"
- "maxiops"

For example,
```
"diskOfferingParameters": [
  "displaytext",
  "disksize",
  "created",
  "storagetype",
  "provisioningtype",
  "iscustomized",
  "miniops",
  "maxiops"
]
```

### Service Offering Availability
Allows you to specify which service offerings will be available for which zones.
If `filterOfferings` is set to `false`, all offerings will be available for all zones.

By default, all offerings will be available for all zones.

For example,
```
"serviceOfferingAvailability": {
  "filterOfferings": true,
  "zones": {
    "zoneId": {
      "diskOfferings": ["offeringId1", "offeringId2"],
      "computeOfferings": ["offeringId3", "offeringId4"]
    }
  }
}
```