export interface CustomOfferingRestriction {
  min?: number;
  max?: number;
}

export interface ICustomOfferingRestrictionsByZone {
  [zone: string]: ICustomOfferingRestrictions;
}

export interface ICustomOfferingRestrictions {
  cpunumber?: CustomOfferingRestriction;
  cpuspeed?:  CustomOfferingRestriction;
  memory?:    CustomOfferingRestriction;
}

export const DefaultCustomServiceOfferingRestrictions: ICustomOfferingRestrictions = {
  cpunumber: {
    min: 0,
    max: Number.POSITIVE_INFINITY
  },
  cpuspeed: {
    min: 0,
    max: Number.POSITIVE_INFINITY
  },
  memory: {
    min: 0,
    max: Number.POSITIVE_INFINITY
  }
};

export class CustomOfferingRestrictions {
  public cpuNumber: CustomOfferingRestriction = {
    min: 0,
    max: Number.POSITIVE_INFINITY
  };

  public cpuSpeed: CustomOfferingRestriction = {
    min: 0,
    max: Number.POSITIVE_INFINITY
  };

  public memory = {
    min: 0,
    max: Number.POSITIVE_INFINITY
  };

  constructor(restrictions: ICustomOfferingRestrictions) {
    Object.keys(restrictions).forEach(key => {
      if (restrictions[key]) {
        if (restrictions[key].min) { this[key].min = restrictions[key].min; }
        if (restrictions[key].max) { this[key].max = restrictions[key].max; }
      }
    });
  }
}
