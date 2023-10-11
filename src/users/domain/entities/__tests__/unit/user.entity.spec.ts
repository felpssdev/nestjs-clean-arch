import { UserEntity, UserProps } from '../../user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'

describe('UserEntity unit tests', () => {
  let props: UserProps
  let sut: UserEntity

  beforeEach(() => {
    UserEntity.validate = jest.fn()

    props = UserDataBuilder({})

    sut = new UserEntity(props)
  })

  it('constructor method', () => {
    expect(UserEntity.validate).toHaveBeenCalled()
    expect(sut.props.name).toEqual(props.name)
    expect(sut.props.email).toEqual(props.email)
    expect(sut.props.password).toEqual(props.password)
    expect(sut.props.createdAt).toBeInstanceOf(Date)
  })

  it('name field getter method', () => {
    expect(sut.name).toBeDefined()
    expect(sut.name).toEqual(props.name)
    expect(typeof sut.name).toBe('string')
  })

  it('name field setter method', () => {
    sut['name'] = 'other name'

    expect(sut.props.name).toEqual('other name')
    expect(typeof sut.props.name).toBe('string')
  })

  it('email field getter method', () => {
    expect(sut.email).toBeDefined()
    expect(sut.email).toEqual(props.email)
    expect(typeof sut.email).toBe('string')
  })

  it('password field getter method', () => {
    expect(sut.password).toBeDefined()
    expect(sut.password).toEqual(props.password)
    expect(typeof sut.password).toBe('string')
  })

  it('password field setter method', () => {
    sut['password'] = 'other password'

    expect(sut.props.password).toEqual('other password')
    expect(typeof sut.props.password).toBe('string')
  })

  it('createdAt field getter method', () => {
    expect(sut.createdAt).toBeDefined()
    expect(sut.createdAt).toBeInstanceOf(Date)
  })

  it('updateName method should update user name', () => {
    expect(UserEntity.validate).toHaveBeenCalled()

    sut.updateName('other name')

    expect(sut.name).toEqual('other name')
  })

  it('updatePassword method should update user password', () => {
    expect(UserEntity.validate).toHaveBeenCalled()

    sut.updatePassword('other password')

    expect(sut.password).toEqual('other password')
  })
})
