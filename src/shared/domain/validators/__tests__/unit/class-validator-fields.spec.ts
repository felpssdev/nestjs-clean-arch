import { ClassValidatorFields } from '../../class-validator-fields'
import * as validatorLib from 'class-validator'

class StubClassValidatorFields extends ClassValidatorFields<{
  field: string
}> {}

describe('ClassValidatorFields unit tests', () => {
  it('should initialize errors and validatedData variables with null', () => {
    const sut = new StubClassValidatorFields()

    expect(sut.validatedData).toBeNull()
    expect(sut.errors).toBeNull()
  })

  it('should validate with errors', () => {
    const spyValidateSync = jest.spyOn(validatorLib, 'validateSync')

    spyValidateSync.mockReturnValue([
      {
        property: 'field',
        constraints: { isRequired: 'test error' },
      },
    ])

    const sut = new StubClassValidatorFields()

    expect(sut.validate({ wrongProperty: 'test' })).toBeFalsy()
    expect(spyValidateSync).toHaveBeenCalled()
    expect(sut.validatedData).toBeNull()
    expect(sut.errors).toStrictEqual({ field: ['test error'] })
  })

  // it('should validate without errors', () => {
  //   const spyValidateSync = jest.spyOn(validatorLib, 'validateSync')

  //   spyValidateSync.mockReturnValue([
  //     {
  //       property: 'field',
  //       constraints: { isRequired: 'test error' },
  //     },
  //   ])

  //   const sut = new StubClassValidatorFields()

  //   expect(sut.validate({ field: 'test' })).toBeTruthy()
  //   expect(spyValidateSync).toHaveBeenCalled()
  //   expect(sut.validatedData).not.toBeNull()
  //   expect(sut.errors).toBeNull()
  // })
})
