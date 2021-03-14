import express from 'express'
const { Router } = require('express') // подключаем роутыры
const router = Router() // подключаем роутыры
const auth = require('../middleware/auth.middleware')

let { playrooms } = require('../temporaryDatabase/temporaryDatabase')

router.post(
  '/generate',
  auth,
  async (req: express.Request, res: express.Response) => {
    try {
      const {roomId} = req.body
      if (!playrooms[roomId]) {
				console.log(playrooms)
				// console.log(playrooms.has(roomId))
				const data = {
					users: {},
          messages: [],
			}
				
        playrooms[roomId] = data
				res.status(201).json({ CreateRoom: true,message: 'Комната создан' })
      } else {
				res.status(201).json({ CreateRoom: false, message:"такая комната есть уже" })
			}
      
    } catch (e) {
      res
        .status(500)
        .json({
          message: 'Что-то пошло не так, попробуйте снова. Ошибка: ' + e,
        })
    }
  }
)

router.get('/', auth, async (req: express.Request, res: express.Response) => {
  try {
		let rooms:Object ={}
		for(let room in playrooms){
			//@ts-ignore
			rooms[room]= Object.keys(playrooms[room].users).length
		}

    res.json(rooms)
		
  } catch (e) {
    res
      .status(500)
      .json({ message: 'Что-то пошло не так, попробуйте снова. Ошибка:' + e })
  }
})

module.exports = router
