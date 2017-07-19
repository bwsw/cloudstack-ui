export interface CustomOfferingRestriction {
  min: number;
  max: number;
}

interface ICustomOfferingRestrictions {
  cpuNumber: CustomOfferingRestriction;
  cpuSpeed:  CustomOfferingRestriction;
  memory:    CustomOfferingRestriction;
}

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
