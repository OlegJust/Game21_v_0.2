import express from 'express'
const { Router } = require('express')
const router = Router()

import User from '../models/User'

const { check, validationResult } = require('express-validator')

const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')

router.post(
  '/register',
  [
    check('name', 'Некорректный name').isString(),
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов').isLength({
      min: 6,
    }),
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректный данные при регистрации',
        })
      }

      const { email, password, name } = req.body

      const candidate = await User.findOne({ email })
        if (candidate) {
          return res
            .status(400)
            .json({ message: 'Такой пользователь уже существует' })
        }

      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({ email, password: hashedPassword, name })

      await user.save()

      res.status(201).json({ message: 'Пользователь создан' })
    } catch (e) {
      res
        .status(500)
        .json({ message: 'Что-то пошло не так, попробуйте снова', e })
    }
  }
)
// GET	--- для получения ккихто даных
// PUT	--- для полного обновления илемента
// PATCH --- чистичное обновление
// DELETE	-- для удаления
// POST -- для создания

router.post(
  '/login',
  [
    check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists(),
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректный данные при входе в систему',
        })
      }

      const { email, password, name } = req.body

      const user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: 'Неверный пароль, попробуйте снова' })
      }

      const token = jwt.sign({ userId: user.id }, config.get('jwtSecret'))

      res.json({ token, userId: user.id, name: name })
    } catch (e) {
      res
        .status(500)
        .json({ message: 'Что-то пошло не так, попробуйте снова', e })
    }
  }
)

export default router
