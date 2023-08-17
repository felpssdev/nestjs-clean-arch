export type FieldsErrors = {
  [field: string]: string[]
}

export interface ValidatorFieldsInterface<ValidatedProps> {
  errors: FieldsErrors
  validatedData: ValidatedProps
  validate(data: any): boolean
}
