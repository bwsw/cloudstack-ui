export interface ICMPType {
  type: number,
  codes: number[],
  text?: string
}

export const ICMPtypes = [
  {
    type: -1,
    codes: [-1]
  },
  {
    type: 0,
    codes: [0]
  },
  {
    type: 3,
    codes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  },
  {
    type: 4,
    codes: [0]
  },
  {
    type: 5,
    codes: [0, 1, 2, 3]
  }, {
    type: 6,
    codes: [0]
  },
  {
    type: 8,
    codes: [0]
  },
  {
    type: 9,
    codes: [0]
  },
  {
    type: 10,
    codes: [0]
  },
  {
    type: 11,
    codes: [0, 1]
  },
  {
    type: 12,
    codes: [0, 1, 2]
  },
  {
    type: 13,
    codes: [0]
  },
  {
    type: 14,
    codes: [0]
  },
  {
    type: 15,
    codes: [0]
  },
  {
    type: 16,
    codes: [0]
  },
  {
    type: 17,
    codes: [0]
  },
  {
    type: 18,
    codes: [0]
  },
  {
    type: 30,
    codes: [0]
  }, {
    type: 31,
    codes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  }, {
    type: 32,
    codes: [0]
  }, {
    type: 33,
    codes: [0]
  }, {
    type: 34,
    codes: [0]
  }, {
    type: 35,
    codes: [0]
  }, {
    type: 36,
    codes: [0]
  }, {
    type: 37,
    codes: [0]
  }, {
    type: 38,
    codes: [0]
  }, {
    type: 39,
    codes: [0]
  }, {
    type: 40,
    codes: [0, 1, 2, 3, 4, 5]
  },
];

export const GetICMPTypeTranslationToken = (type) => {
  return `SECURITY_GROUP_PAGE.ICMP_TYPES.${type}.description`;
};

export const GetICMPCodeTranslationToken = (type, code) => {
  return `SECURITY_GROUP_PAGE.ICMP_TYPES.${type}.codes.${code}`;
};
