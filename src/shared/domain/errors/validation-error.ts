import { FieldsErrors } from '../validators/validator-fields.interface'

export class ValidationError extends Error {}

export class ValidationErrorEntity extends Error {
  constructor(public error: FieldsErrors) {
    super('Entity Validation Error')
    this.name = 'ValidationErrorEntity'
  }
}
