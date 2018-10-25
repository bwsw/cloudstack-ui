# Config Guide

You can see examples of the configurations in the [config-example.json](https://github.com/bwsw/cloudstack-ui/blob/master/src/config/config-example.json)

- [General](#general)
  - [Default Domain](#default-domain)
  - [Session Refresh Interval](#session-refresh-interval)
  - [API Doc Link](#api-doc-link)
  - [Extensions](#extensions)
- [Virtual Machines Settings](#virtual-machines-settings)
  - [VM Colors](#vm-colors)
- [Firewall (Security Groups) Settings](#firewall-security-groups-settings)
  - [Security Group Templates](#security-group-templates)
  - [Default Security Group Name](#default-security-group-name)
- [Images Settings](#images-settings)
  - [Image Groups](#image-groups)
- [User App Settings](#user-app-settings)
  - [Default First Day Of Week](#default-first-day-of-week)
  - [Default Interface Language](#default-interface-language)
  - [Default Time Format](#default-time-format)
  - [Default Theme](#default-theme)
  - [Session Timeout](#session-timeout)
- [Service Offering Setting](#service-offering-setting)
  - [Custom Compute Offering Parameters](#custom-compute-offering-parameters)
  - [Default Compute Offering](#default-compute-offering)
  - [Offering Compatibility Policy](#offering-compatibility-policy)
  - [Compute Offering Classes](#compute-offering-classes)
  - [Service Offering Availability](#service-offering-availability)

## General

### Default Domain

A default domain is used to fill in the 'Domain' field in the login form. The default value is an empty value.

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

A URL address to the API documentation. This address is displayed in the "Settings" section.
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
  "pulse": false,
  "vmLogs": false
}
```

Please check [Wiki](https://github.com/bwsw/cloudstack-ui/wiki/Plugins) for a detailed information about plugins.

## Virtual Machines Settings

### VM Colors

Allows you to predefine a set of colors for virtual machines in the hexadecimal format.
You can specify any colors you like.

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

## Firewall (Security Groups) Settings

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

- id
- name
- description
- preselected (true or false) - specifies whether network rules from this template will be automatically selected in the VM creation form
- ingress and egress rules (ingressrule and egressrule respectively):
  - ruleid: a unique identifier
  - protocol: either 'tcp', 'udp' or 'icmp'
  - cidr: subnet mask (e.g. 0.0.0.0/0)
  - For TCP and UDP: startport and endport
  - For ICMP: icmpcode and icmptype

### Default Security Group Name

Allow you to rename the Default Firewall group.
The default name is `default` for both languages.

For example,

```
"defaultSecurityGroupName": {
  "en": "default name",
  "ru": "имя по умолчанию"
}
```

## Images Settings

### Image Groups

Allows you to define groups for installation sources (templates and ISOs).

An image group has a required `id` parameter and an optional `translations` parameter.
If there are no translations defined for the template group, the group ID will be used.

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

## User App Settings

### Default First Day Of Week

Allows you to predefine the setting of the first day in the app. Possible values:

- 0 - Sunday
- 1 - Monday (default)

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

### Default Theme

Allows you to predefine the setting of the theme. Available themes are:

- "blue-red" (default)
- "indigo-pink"

For example,

```
"defaultTheme": "blue-red"
```

### Session Timeout

Allows you to predefine the setting of the session timeout.
This setting determines the number of minutes the user's session should stay active.
After this time passes a user is logged out.
You can set it to `0` to turn it off, although in this case the session is likely to expire on the server side.

The default value is `30`.

For example,

```
"sessionTimeout": 30
```

## Service Offering Setting

### Custom Compute Offering Parameters

Allows you to specify default values and limits for custom compute offering hardware parameters in VM creation.
By default, all compute offerings have the minimum restrictions of "1" CPU number, "1000" CPU speed, "512" memory
and the maximum values are not limited, default values are equal to minimum restrictions.

For example,

```
"customComputeOfferingParameters": [
  {
    "offeringId": "73cdef05-d01f-49ad-8ecb-4f2ffd7d8e26",
    "cpunumber": {
      "min": 2,
      "max": 8,
      "value": 4
    },
    "cpuspeed": {
      "min": 1000,
      "max": 3000,
      "value": 1500
    },
    "memory": {
      "min": 512,
      "max": 8192,
      "value": 512
    }
  }
]
```

### Default Compute Offering

Allows you to specify compute offering that will be automatically preselected in the VM creation form for each zone.

For example,

```
"defaultComputeOffering": [
  {
    "zoneId": "415db026-1135-496e-9383-0c820a75694e",
    "offeringId": "f216bd08-947a-4022-8271-c29e9acfffb9"
  }
]
```

### Offering Compatibility Policy

This configuration allows you to restrict compute offering change based on the compute offering host tags.

This is very useful when you have several clusters in one zone and you want to protect a user from converting
offerings between incompatible states because it might happen that selected offering is not supported in the cluster where storage of
current VM relates to.

Available change policies:

- "contains-all" - exact tags match
- "exactly-match" - old offering tags are subset new offering tags
- "no-restrictions" (default)

You can ignore tags that don't influence compatibility with `offeringChangePolicyIgnoreTags` property.

```
"offeringCompatibilityPolicy": {
 "offeringChangePolicy": "exactly-match",
 "offeringChangePolicyIgnoreTags": ["t1"]
}
```

### Compute Offering Classes

Allows you to group compute offerings into classes when choosing a compute offering in the VM creation form.

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

### Service Offering Availability

Allows you to specify which service offerings will be available for which zones.
If `filterOfferings` is set to `false`, all offerings will be available for all zones.

By default, `filterOfferings` is set to `false`.

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
