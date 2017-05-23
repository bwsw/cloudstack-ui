import 'reflect-metadata';

import { BaseModel } from './base.model';
import { FieldMapper } from '../decorators/field-mapper.decorator';


describe('Base model', () => {
  @FieldMapper({
    testfield1: 'field1',
    testfield2: 'field2',
  })
  class TestModel extends BaseModel {
    public id: string;
    public field1: string;
    public field2: string;
  }

  @FieldMapper({
    derivfield: 'derivField'
  })
  class TestModelDeriv extends TestModel {
    public derivField;
  }

  const params = {
    id: 'id',
    testfield1: 'test',
    testfield2: 'test2'
  };

  it('should parse params correctly', () => {
    const testModel = new TestModel(params);

    expect(testModel.id).toBe(params.id);
    expect(testModel.field1).toBe(params.testfield1);
    expect(testModel.field2).toBe(params.testfield2);
  });

  it('should be serialized correctly', () => {
    const testModel = new TestModel(params);
    expect(testModel.serialize()).toEqual(params);
  });

  it('should allow to extend base model with a class with field mapper', () => {
    const derivParams = {
      derivfield: 5
    };
    const derivModel = new TestModelDeriv(Object.assign({}, params, derivParams));

    expect(derivModel.id).toBe(params.id);
    expect(derivModel.field1).toBe(params.testfield1);
    expect(derivModel.field2).toBe(params.testfield2);
    expect(derivModel.derivField).toBe(derivParams.derivfield);
  });
});
