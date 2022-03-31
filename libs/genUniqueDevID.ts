import { nanoid } from 'nanoid'

const genFunction = (length: number = 20) => {
  return nanoid(length)
}

export default genFunction
