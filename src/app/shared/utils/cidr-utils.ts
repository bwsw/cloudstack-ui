import { IPVersion } from '../../security-group/sg.model';

export class CidrUtils {
  private static readonly ipV4 =
    '(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}';
  private static readonly cidrV4 = `${CidrUtils.ipV4}\\/(3[0-2]|[12]?[0-9])`;
  private static readonly cidrV4Regex = new RegExp(`^${CidrUtils.cidrV4}$`);

  private static readonly ipV6Seg = '[a-fA-F\\d]{1,4}';
  private static readonly ipV6 =
    '(' +
    `(?:${CidrUtils.ipV6Seg}:){7}(?:${CidrUtils.ipV6Seg}|:)|` +
    `(?:${CidrUtils.ipV6Seg}:){6}(?:${CidrUtils.ipV4}|:${CidrUtils.ipV6Seg}|:)|` +
    `(?:${CidrUtils.ipV6Seg}:){5}(?::${CidrUtils.ipV4}|(:${CidrUtils.ipV6Seg}){1,2}|:)|` +
    `(?:${CidrUtils.ipV6Seg}:){4}(?:(:${CidrUtils.ipV6Seg}){0,1}:${CidrUtils.ipV4}|(:${
      CidrUtils.ipV6Seg
    }){1,3}|:)|` +
    `(?:${CidrUtils.ipV6Seg}:){3}(?:(:${CidrUtils.ipV6Seg}){0,2}:${CidrUtils.ipV4}|(:${
      CidrUtils.ipV6Seg
    }){1,4}|:)|` +
    `(?:${CidrUtils.ipV6Seg}:){2}(?:(:${CidrUtils.ipV6Seg}){0,3}:${CidrUtils.ipV4}|(:${
      CidrUtils.ipV6Seg
    }){1,5}|:)|` +
    `(?:${CidrUtils.ipV6Seg}:){1}(?:(:${CidrUtils.ipV6Seg}){0,4}:${CidrUtils.ipV4}|(:${
      CidrUtils.ipV6Seg
    }){1,6}|:)|` +
    `(?::((?::${CidrUtils.ipV6Seg}){0,5}:${CidrUtils.ipV4}|(?::${CidrUtils.ipV6Seg}){1,7}|:))` +
    ')(%[0-9a-zA-Z]{1,})?';
  private static readonly cidrV6 = `${CidrUtils.ipV6}\\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])`;
  private static readonly cidrV6Regex = new RegExp(`^${CidrUtils.cidrV6}$`);

  public static isCidrV4Valid(cidr: string): boolean {
    return CidrUtils.cidrV4Regex.test(cidr);
  }

  public static isCidrV6Valid(cidr: string): boolean {
    return CidrUtils.cidrV6Regex.test(cidr);
  }

  public static isCidrValid(cidr: string): boolean {
    const isIPv4 = CidrUtils.isCidrV4Valid(cidr);
    const isIPv6 = CidrUtils.isCidrV6Valid(cidr);
    return isIPv4 || isIPv6;
  }

  public static getCidrIpVersion(cidr: string): IPVersion | null {
    const isIPv4 = CidrUtils.isCidrV4Valid(cidr);
    const isIPv6 = CidrUtils.isCidrV6Valid(cidr);

    if (isIPv4) {
      return IPVersion.ipv4;
    }
    if (isIPv6) {
      return IPVersion.ipv6;
    }
    return null;
  }
}
