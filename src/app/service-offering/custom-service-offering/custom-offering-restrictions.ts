export class CustomOfferingRestrictions {
  public cpuNumber = { min: 0, max: Number.POSITIVE_INFINITY};
  public cpuSpeed  = { min: 0, max: Number.POSITIVE_INFINITY};
  public memory    = { min: 0, max: Number.POSITIVE_INFINITY};

  constructor(restrictions: {
    cpuNumber: { min: number, max: number },
    cpuSpeed:  { min: number, max: number },
    memory:    { min: number, max: number }
  }) {
    Object.keys(restrictions).forEach(key => {
      if (restrictions[key]) {
        if (restrictions[key].min) { this[key].min = restrictions[key].min; }
        if (restrictions[key].max) { this[key].max = restrictions[key].max; }
      }
    });
  }
}
