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
  const icmpTypeTranslations = {
    '-1': 'SECURITY_GROUP_PAGE.ICMP_TYPES.-1.description',
    '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.0.description',
    '3': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.description',
    '4': 'SECURITY_GROUP_PAGE.ICMP_TYPES.4.description',
    '5': 'SECURITY_GROUP_PAGE.ICMP_TYPES.5.description',
    '6': 'SECURITY_GROUP_PAGE.ICMP_TYPES.6.description',
    '8': 'SECURITY_GROUP_PAGE.ICMP_TYPES.8.description',
    '9': 'SECURITY_GROUP_PAGE.ICMP_TYPES.9.description',
    '10': 'SECURITY_GROUP_PAGE.ICMP_TYPES.10.description',
    '11': 'SECURITY_GROUP_PAGE.ICMP_TYPES.11.description',
    '12': 'SECURITY_GROUP_PAGE.ICMP_TYPES.12.description',
    '13': 'SECURITY_GROUP_PAGE.ICMP_TYPES.13.description',
    '14': 'SECURITY_GROUP_PAGE.ICMP_TYPES.14.description',
    '15': 'SECURITY_GROUP_PAGE.ICMP_TYPES.15.description',
    '16': 'SECURITY_GROUP_PAGE.ICMP_TYPES.16.description',
    '17': 'SECURITY_GROUP_PAGE.ICMP_TYPES.17.description',
    '18': 'SECURITY_GROUP_PAGE.ICMP_TYPES.18.description',
    '30': 'SECURITY_GROUP_PAGE.ICMP_TYPES.30.description',
    '31': 'SECURITY_GROUP_PAGE.ICMP_TYPES.31.description',
    '32': 'SECURITY_GROUP_PAGE.ICMP_TYPES.32.description',
    '33': 'SECURITY_GROUP_PAGE.ICMP_TYPES.33.description',
    '34': 'SECURITY_GROUP_PAGE.ICMP_TYPES.34.description',
    '35': 'SECURITY_GROUP_PAGE.ICMP_TYPES.35.description',
    '36': 'SECURITY_GROUP_PAGE.ICMP_TYPES.36.description',
    '37': 'SECURITY_GROUP_PAGE.ICMP_TYPES.37.description',
    '38': 'SECURITY_GROUP_PAGE.ICMP_TYPES.38.description',
    '39': 'SECURITY_GROUP_PAGE.ICMP_TYPES.39.description',
    '40': 'SECURITY_GROUP_PAGE.ICMP_TYPES.40.description'
  };

  return icmpTypeTranslations[type];
};

export const GetICMPCodeTranslationToken = (type, code) => {
  const icmpCodeTranslations = {
    '-1': { '-1': 'SECURITY_GROUP_PAGE.ICMP_TYPES.-1.codes.-1' },
    '0': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.0.codes.0' },
    '3': {
      '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.0',
      '1': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.1',
      '2': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.2',
      '3': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.3',
      '4': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.4',
      '5': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.5',
      '6': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.6',
      '7': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.7',
      '8': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.8',
      '9': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.9',
      '10': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.10',
      '11': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.11',
      '12': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.12',
      '13': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.13',
      '14': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.14',
      '15': 'SECURITY_GROUP_PAGE.ICMP_TYPES.3.codes.15',
    },
    '4': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.4.codes.0' },
    '5': {
      '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.5.codes.0',
      '1': 'SECURITY_GROUP_PAGE.ICMP_TYPES.5.codes.1',
      '2': 'SECURITY_GROUP_PAGE.ICMP_TYPES.5.codes.2',
      '3': 'SECURITY_GROUP_PAGE.ICMP_TYPES.5.codes.3',
    },
    '8': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.8.codes.0' },
    '9': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.9.codes.0' },
    '10': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.10.codes.0' },
    '11': {
      '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.11.codes.0',
      '1': 'SECURITY_GROUP_PAGE.ICMP_TYPES.11.codes.1'
    },
    '12': {
      '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.12.codes.0',
      '1': 'SECURITY_GROUP_PAGE.ICMP_TYPES.12.codes.1',
      '2': 'SECURITY_GROUP_PAGE.ICMP_TYPES.12.codes.2'
    },
    '13': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.13.codes.0' },
    '14': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.14.codes.0' },
    '15': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.15.codes.0' },
    '16': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.16.codes.0' },
    '17': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.17.codes.0' },
    '18': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.18.codes.0' },
    '30': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.30.codes.0' },
    '31': {
      '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.31.codes.0',
      '1': 'SECURITY_GROUP_PAGE.ICMP_TYPES.31.codes.1',
      '2': 'SECURITY_GROUP_PAGE.ICMP_TYPES.31.codes.2',
      '3': 'SECURITY_GROUP_PAGE.ICMP_TYPES.31.codes.3',
      '4': 'SECURITY_GROUP_PAGE.ICMP_TYPES.31.codes.4',
      '5': 'SECURITY_GROUP_PAGE.ICMP_TYPES.31.codes.5',
      '6': 'SECURITY_GROUP_PAGE.ICMP_TYPES.31.codes.6',
      '7': 'SECURITY_GROUP_PAGE.ICMP_TYPES.31.codes.7',
      '8': 'SECURITY_GROUP_PAGE.ICMP_TYPES.31.codes.8',
      '9': 'SECURITY_GROUP_PAGE.ICMP_TYPES.31.codes.9',
      '10': 'SECURITY_GROUP_PAGE.ICMP_TYPES.31.codes.10',
      '11': 'SECURITY_GROUP_PAGE.ICMP_TYPES.31.codes.11'
    },
    '32': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.32.codes.0' },
    '33': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.33.codes.0' },
    '34': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.34.codes.0' },
    '35': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.35.codes.0' },
    '36': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.36.codes.0' },
    '37': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.37.codes.0' },
    '38': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.38.codes.0' },
    '39': { '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.39.codes.0' },
    '40': {
      '0': 'SECURITY_GROUP_PAGE.ICMP_TYPES.40.codes.0',
      '1': 'SECURITY_GROUP_PAGE.ICMP_TYPES.40.codes.1',
      '2': 'SECURITY_GROUP_PAGE.ICMP_TYPES.40.codes.2',
      '3': 'SECURITY_GROUP_PAGE.ICMP_TYPES.40.codes.3',
      '4': 'SECURITY_GROUP_PAGE.ICMP_TYPES.40.codes.4',
      '5': 'SECURITY_GROUP_PAGE.ICMP_TYPES.40.codes.5'
    }
  };

  return icmpCodeTranslations[type][code];
};
