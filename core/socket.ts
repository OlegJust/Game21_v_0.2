
const socket = require('socket.io')

let { playrooms } = require('../temporaryDatabase/temporaryDatabase')

interface RoomData {
  name: string
  roomId: string
}

export const createSocket = (http: any, options: any) => {
  //@ts-ignore
  const io = socket(http, options)

  io.on('connection', function (socket: any) {
    console.log('a user connected')

    // ---------- когда он заходит в комноту то он получает все даные о комнатах
    socket.on('LOADINGUSER', (data: RoomData) => {
      let room 
			if (data.roomId.startsWith("game21")) {
				room = data.roomId.slice(7) //=== удоляем "game21=" чтобы получить имя комноты
			} else {
				room = data.roomId
			}
			socket.join(room)

			if (!playrooms[room]) {
        socket.to(data.roomId).emit('get playroom', false)
      } // если такой комнаты нету

			let nevUser = playrooms[room].users.indexOf( data.name )!= -1
      if (!nevUser) {
        playrooms[room].users.push(data.name)
      } // добовляем пользователей
			
      const playroom = playrooms[room]
			console.log(playrooms[room].users)
			io.to(socket.id).emit("USER:LOADINGUSER", {users: playroom.users, messages:playroom.messages});
      socket.to(data.roomId).emit('ROOM:SET_USERS', playroom.users)
    })

    // ----------------------------------------- создание комноты
		socket.on('ROOM:NEW_MESSAGE', (data:any) => {
			const { roomId, userName, text } = data
			const obj = {
				userName,
				text,
			}
			playrooms[roomId].messages.push(obj)
			socket.to(roomId).broadcast.emit('ROOM:NEW_MESSAGE', obj)
		})
		socket.on('NEW__ROOM', (data:any) => {
			playrooms[data.roomId].users = [data.name]
			socket.broadcast.emit('new playroom', {roomId: data.roomId, users:1})
		})
	
		socket.on('disconnect', () => {
			console.log("disconnect")
		})
  })


  

  return io
}
