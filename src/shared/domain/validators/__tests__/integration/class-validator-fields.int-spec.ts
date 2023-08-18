import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'
import { ClassValidatorFields } from '../../class-validator-fields'

class StubRules {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string

  @IsNotEmpty()
  @IsNumber()
  price: number

  constructor(data: any) {
    Object.assign(this, data)
  }
}

class StubClassValidatorFields extends ClassValidatorFields<StubRules> {
  validate(data: any) {
    return super.validate(new StubRules(data))
  }
}

describe('ClassValidatorFields integration tests', () => {
  it('should validate with errors', () => {
    const validator = new StubClassValidatorFields()

    expect(validator.validate(null)).toBeFalsy()
    expect(validator.errors).toStrictEqual({
      name: [
        'name must be shorter than or equal to 255 characters',
        'name must be a string',
        'name should not be empty',
      ],
      price: [
        'price must be a number conforming to the specified constraints',
        'price should not be empty',
      ],
    })
  })

  it('should validate without errors', () => {
    const validator = new StubClassValidatorFields()

    expect(validator.validate({ name: 'name test', price: 20 })).toBeTruthy()
    expect(validator.validatedData).toStrictEqual(
      new StubRules({ name: 'name test', price: 20 }),
    )
  })
})
