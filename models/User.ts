const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  name: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true}, // так как это обизательное поле ставим required: true
  // так у нас может быть только один пользователь с таким email то мы ставим unique: true
  password: {type: String, required: true},
  //links: { type: Types.ObjectId, ref: 'Link' } // ref какой коллекции мы привязываемся //  в этом случае присваем к пользоватлю Link
})
const User = model('User', schema)

export default User
