import { instanceToPlain } from 'class-transformer'
import { UserPresenter } from '../../user.presenter'

describe('UserPresenter unit tests', () => {
  let sut: UserPresenter
  const createdAt = new Date()
  const props = {
    id: '8544973c-d1da-41e7-a4fd-f26d54d2f1b2',
    name: 'fake name',
    email: 'test@mail.com',
    password: 'fakepassword',
    createdAt,
  }

  beforeEach(() => {
    sut = new UserPresenter(props)
  })

  describe('constructor', () => {
    it('should set values', () => {
      expect(sut.id).toEqual(props.id)
      expect(sut.name).toEqual(props.name)
      expect(sut.email).toEqual(props.email)
      expect(sut.createdAt).toEqual(props.createdAt)
    })
  })

  it('should successfully present data', () => {
    const output = instanceToPlain(sut)
    expect(output).toStrictEqual({
      id: '8544973c-d1da-41e7-a4fd-f26d54d2f1b2',
      name: 'fake name',
      email: 'test@mail.com',
      createdAt: createdAt.toISOString(),
    })
  })
})
