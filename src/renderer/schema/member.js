import { EntitySchema } from 'typeorm'
import Member from '../model/member'

const table = {
  name: 'Member',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    name: {
      type: 'varchar'
    },
    sex: {
      type: 'boolean'
    },
    age: {
      type: 'int'
    },
    birthday: {
      type: 'datetime'
    }
  }
}

const entity = new EntitySchema(Object.assign(table, { target: Member }))

export {
  table,
  entity
}
