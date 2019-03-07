const typeorm = require('typeorm')
const fs = require('fs')
const path = require('path')

const entities = fs.readdirSync(path.join(__dirname, 'schema')).map((file) => {
  return require('./' + path.join('schema', file)).entity
})
console.log(entities)

export default {
  conn () {
    return typeorm.createConnection({
      type: 'sqlite',
      database: 'app.db',
      entities,
      synchronize: true,
      logging: {
        logQueries: true
      }
    })
  }
}
