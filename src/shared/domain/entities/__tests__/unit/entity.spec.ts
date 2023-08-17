import { validate as uuidValidate } from 'uuid'
import { Entity } from '../../entity'

type StubProps = {
  prop1: string
  prop2: number
}

class StubEntity extends Entity<StubProps> {}

describe('Entity unit tests', () => {
  const props: StubProps = { prop1: 'prop1', prop2: 1 }
  const uuid = '618d4292-2213-4937-941a-5639b66d3209'

  it('should set props and id', () => {
    const entity = new StubEntity(props)

    expect(entity.props).toStrictEqual(props)
    expect(entity._id).not.toBeNull()
    expect(uuidValidate(entity._id)).toBeTruthy()
  })

  it('should accept valid uuid', () => {
    const entity = new StubEntity(props, uuid)

    expect(uuidValidate(entity._id)).toBeTruthy()
    expect(entity._id).toEqual(uuid)
  })

  it('should convert an entity to JSON', () => {
    const entity = new StubEntity(props, uuid)

    expect(entity.toJSON()).toStrictEqual({
      id: uuid,
      ...props,
    })
  })
})
