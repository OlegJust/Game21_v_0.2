const socket = require('socket.io')

let { playrooms } = require('../temporaryDatabase/temporaryDatabase')

interface Username {
  name: string
  roomId: string
}

export const createSocket = (http: any, options: any) => {
  //@ts-ignore
  const io = socket(http, options)

  io.on('connection', function (socket: any) {
    console.log('a user connected')

    // ---------- когда он заходит в комноту то он получает все даные о комнатах
    socket.on('add loadingUser', (username: Username) => {
      socket.join(username.roomId)

      let room 
			if (username.roomId.startsWith("game21")) {
				room = username.roomId.slice(7) //=== удоляем "game21=" чтобы получить имя комноты
			} else {
				room = username.roomId
			}

			if (!playrooms[room]) {
        socket.to(username.roomId).emit('get playroom', false)
      } // если такой комнаты нету

      if (playrooms[room].users[username.name]) {
        playrooms[room].users[username.name].push = socket.id
      } else {
        playrooms[room].users[username.name] = [socket.id]
      } // добовляем пользователей

      const playroom = playrooms[room]
			socket.broadcast.emit('new playroom', {roomId: room,users: Object.keys(playroom.users).length})
      socket.to(username.roomId).emit('get playroom', playroom)
    })

    // ----------------------------------------- создание комноты
    socket.on('add playroom', (username: Username) => {
      let participants = []
      participants.push(username.name)
      playrooms.push({
        nameRoom: username.roomId,
        participants: participants,
        _id: socket.id,
      })
      socket.broadcast.emit('get playroom', playrooms)
    })

    socket.on('disconnect', () => {
      console.log('a user disconnect');
    })
		socket.on('ROOM:NEW_MESSAGE', (data:any) => {
			const { roomId, userName, text } = data
			const obj = {
				userName,
				text,
			}
			playrooms[roomId].messages.push(obj)
			socket.to(roomId).broadcast.emit('ROOM:NEW_MESSAGE', obj)
		})
	
		socket.on('disconnect', () => {
			console.log("disconnect")
		})
  })


  

  return io
}
