import { validateSync } from 'class-validator'
import {
  FieldsErrors,
  ValidatorFieldsInterface,
} from './validator-fields.interface'
import { ValidationError } from '@nestjs/common'

export abstract class ClassValidatorFields<ValidatedProps>
  implements ValidatorFieldsInterface<ValidatedProps>
{
  errors: FieldsErrors = null
  validatedData: ValidatedProps = null

  validate(data: any): boolean {
    const errors: ValidationError[] = validateSync(data)

    if (errors.length) {
      this.errors = {}

      errors.forEach(error => {
        const field = error.property

        this.errors[field] = Object.values(error.constraints)
      })
    } else {
      this.validatedData = data
    }

    return !errors.length
  }
}
