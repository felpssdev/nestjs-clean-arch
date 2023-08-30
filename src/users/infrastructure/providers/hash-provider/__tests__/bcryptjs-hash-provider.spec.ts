import { BcryptjsHashProvider } from '../bcryptjs-hash-provider'

describe('BcryptjsHashProvider unit tests', () => {
  let sut: BcryptjsHashProvider

  beforeEach(() => {
    sut = new BcryptjsHashProvider()
  })

  it('should return an encrypted password', async () => {
    const password = '123456testPassword'
    const hash = await sut.generateHash(password)

    expect(hash).toBeDefined()
    expect(password).not.toEqual(hash)
  })

  it('should return false on invalid password and hash comparison', async () => {
    const password = '123456testPassword'
    const hash = await sut.generateHash(password)
    const result = await sut.compareHash('fake', hash)

    expect(result).toBeFalsy()
  })

  it('should return true on valid password and hash comparison', async () => {
    const password = '123456testPassword'
    const hash = await sut.generateHash(password)
    const result = await sut.compareHash(password, hash)

    expect(result).toBeTruthy()
  })
})
