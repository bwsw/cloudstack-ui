export interface IcmpType {
  type: number;
  codes: number[];
  text?: string;
}

// CloudStack docs:
// The ICMP type. A value of -1 means all types.
// The ICMP code. A value of -1 means all codes for the given ICMP type.
export const icmpV4Types: IcmpType[] = [
  { type: -1, codes: [-1] },
  { type: 0, codes: [0] },
  { type: 3, codes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] },
  { type: 4, codes: [0] },
  { type: 5, codes: [0, 1, 2, 3] },
  { type: 6, codes: [0] },
  { type: 8, codes: [0] },
  { type: 9, codes: [0] },
  { type: 10, codes: [0] },
  { type: 11, codes: [0, 1] },
  { type: 12, codes: [0, 1, 2] },
  { type: 13, codes: [0] },
  { type: 14, codes: [0] },
  { type: 15, codes: [0] },
  { type: 16, codes: [0] },
  { type: 17, codes: [0] },
  { type: 18, codes: [0] },
  { type: 30, codes: [0] },
  { type: 31, codes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
  { type: 32, codes: [0] },
  { type: 33, codes: [0] },
  { type: 34, codes: [0] },
  { type: 35, codes: [0] },
  { type: 36, codes: [0] },
  { type: 37, codes: [0] },
  { type: 38, codes: [0] },
  { type: 39, codes: [0] },
  { type: 40, codes: [0, 1, 2, 3, 4, 5] },
];

export const icmpV6Types: IcmpType[] = [
  { type: -1, codes: [-1] },
  { type: 1, codes: [0, 1, 2, 3, 4, 5, 6] },
  { type: 2, codes: [0] },
  { type: 3, codes: [0, 1] },
  { type: 4, codes: [0, 1, 2] },
  { type: 100, codes: [0] },
  { type: 101, codes: [0] },
  { type: 127, codes: [0] },
  { type: 128, codes: [0] },
  { type: 129, codes: [0] },
  { type: 130, codes: [0] },
  { type: 131, codes: [0] },
  { type: 132, codes: [0] },
  { type: 133, codes: [0] },
  { type: 134, codes: [0] },
  { type: 135, codes: [0] },
  { type: 136, codes: [0] },
  { type: 137, codes: [0] },
  { type: 138, codes: [0, 1, 255] },
  { type: 139, codes: [0, 1, 2] },
  { type: 140, codes: [0, 1, 2] },
  { type: 141, codes: [0] },
  { type: 142, codes: [0] },
  { type: 144, codes: [0] },
  { type: 145, codes: [0] },
  { type: 146, codes: [0] },
  { type: 147, codes: [0] },
  { type: 160, codes: [0] },
  { type: 161, codes: [0, 1, 2, 3, 4] },
  { type: 200, codes: [0] },
  { type: 201, codes: [0] },
  { type: 255, codes: [0] },
];

export const getICMPTypeTranslationToken = (type: number) => {
  return `SECURITY_GROUP_PAGE.ICMP_TYPES.${type}.description`;
};

export const getICMPCodeTranslationToken = (type: number, code: number) => {
  return `SECURITY_GROUP_PAGE.ICMP_TYPES.${type}.codes.${code}`;
};

export const getICMPV6TypeTranslationToken = (type: number) => {
  return `SECURITY_GROUP_PAGE.ICMP_V6_TYPES.${type}.description`;
};

export const getICMPV6CodeTranslationToken = (type: number, code: number) => {
  return `SECURITY_GROUP_PAGE.ICMP_V6_TYPES.${type}.codes.${code}`;
};
