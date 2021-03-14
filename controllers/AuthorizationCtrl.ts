import express from 'express'
import User from '../models/User'
import config from 'config'
const bcrypt = require('bcryptjs')
import jwt from 'jsonwebtoken'

export class AuthorizationCtrl {
  register = async (req: express.Request, res: express.Response) => {
    // res --- response --- ответ;req --- request --- запрос
    try {
			console.log("yes")
      // |------------- теперь логика  логикой ------------|

      const { email, password, name } = req.body // в боде приходит инфо из фронтенда

      // логика регистрациии, проверяем если такой email в базе если нету то выдаем ощыбку не регистрируемого пользователя
      const candidate = await User.findOne({ email }) // await -- ждем, ждем пока модель пользователя(User) будет искать человека по  email // короче с начала проверяем нет ли ктото с таким же еmail

      if (candidate) {
        return res
          .status(400)
          .json({ message: 'Такой пользователь уже существует' }) // .json вывести сообщение
      }
      // зашифровать его пароль есль будем просто его хранит то его можно лигко взломать
      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({ email, password: hashedPassword, name }) // создаем нового пользователя

      await user.save() // ждём пока пользователь сахраница после того когда этот промис завершится

      res.status(201).json({ message: 'Пользователь создан' }) // мы отвечаем фронтеду
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  }
  login = async (req: express.Request, res: express.Response) => {
    try {
      // дальше логика

      const { email, password, name } = req.body

      const user = await User.findOne({ email }) // есть ли такой чиловек

      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' })
      }
      // проверяем пароль
      const isMatch = await bcrypt.compare(password, user.password) // compare --- мы сравниваем пароль с зашифрованым

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: 'Неверный пароль, попробуйте снова' })
      }
      // если вы дошли до сюда то у пользователя все хорошо теперь мы проши авторизацию

      //создаем токен
      const token = jwt.sign(
        { userId: user.id }, // в первом мы указываем те даные которые будут зашифровать в даном jwt токене
        config.get('jwtSecret') // вторым передаем секретный ключь
      )

      res.json({ token, userId: user.id, name: name }) // статус не указываем он по умалчанию 200
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  }
}

export default AuthorizationCtrl
