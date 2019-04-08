const typeorm = require('typeorm')
// const fs = require('fs')
const path = require('path')
const config = require('../../ormconfig.json')
const remote = require('electron').remote
const app = remote.app
const basePath = app.getPath('userData')
const entities = [
  'Note', 'Record', 'Member', 'Medicine', 'Formula'
].map(name => require('./entity/' + name)[name])
require('reflect-metadata')

// NOTE 会造成运行时问题
// const entities = fs.readdirSync(path.join(__dirname, 'entity')).map((file) => {
//   let name = file.split('.')[0]
//   return require('./' + path.join('entity', file))[name]
// })

export default {
  conn () {
    const ormConfig = Object.assign({}, config, {
      database: path.join(basePath, 'app.db'),
      entities,
      synchronize: true,
      logging: true
    })
    return typeorm.createConnection(ormConfig)
  }
}
