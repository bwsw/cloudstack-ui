import * as sessionRefreshInterval from './session-refresh-interval.scheme.json';
import * as defaultDomain from './default-domain.scheme.json';
import * as apiDocLink from './api-doc-link.scheme.json';
import * as extensions from './extensions.scheme.json';
import * as vmLogs from './vm-logs.scheme.json';
import * as resourceLimits from './resource-limits.scheme.json';

import * as vmColors from './vm-colors.scheme.json';

import * as defaultFirstDayOfWeek from './default-first-day-of-week.scheme.json';
import * as defaultInterfaceLanguage from './default-interface-language.scheme.json';
import * as defaultTimeFormat from './default-time-format.scheme.json';
import * as defaultTheme from './default-theme.scheme.json';
import * as sessionTimeout from './session-timeout.scheme.json';

import * as defaultComputeOffering from './default-compute-offering.scheme.json';
import * as computeOfferingClasses from './compute-offering-classes.scheme.json';
import * as serviceOfferingAvailability from './service-offering-availability.scheme.json';
import * as customComputeOfferingParameters from './custom-compute-offering-parameters.scheme.json';
import * as offeringCompatibilityPolicy from './offering-compatibility-policy.scheme.json';

import * as securityGroupTemplates from './security-group-templates.scheme.json';

import * as imageGroups from './image-groups.scheme.json';
import * as defaultSecurityGroupName from './default-security-group-name.scheme.json';
import * as vmSnapLimit from './vm-snap-limit.scheme.json';
import * as autoGenerateUserKeys from './auto-generate-user-keys.scheme.json';

export {
  // General
  defaultDomain,
  sessionRefreshInterval,
  apiDocLink,
  extensions,
  // Log View settings
  vmLogs,
  // Resource limits settings
  resourceLimits,
  // Virtual machines settings
  vmColors,
  vmSnapLimit,
  // User app settings
  defaultFirstDayOfWeek,
  defaultInterfaceLanguage,
  defaultTimeFormat,
  defaultTheme,
  sessionTimeout,
  // Service offering setting
  customComputeOfferingParameters,
  defaultComputeOffering,
  serviceOfferingAvailability,
  computeOfferingClasses,
  offeringCompatibilityPolicy,
  // Security groups
  securityGroupTemplates,
  // Images settings
  imageGroups,
  // Firewall (Security groups) settings
  defaultSecurityGroupName,
  // User
  autoGenerateUserKeys,
};
