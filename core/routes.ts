import bodyParser from 'body-parser'
import express from 'express'
import socket from "socket.io";

import AuthorizationCtrl from '../routes/auth.routes'
import Playrooms from '../routes/playrooms.routes'

const createRoutes = (app: express.Express, io: socket.Server) => {
  //const AuthorizationController = new AuthorizationCtrl(io);
  //const AuthorizationController = new AuthorizationCtrl();

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.get('/api/', (_: express.Request, res: express.Response) => {
    res.status(201).json({ message: 'Hello world' })
  })

  app.use('/api/auth', AuthorizationCtrl)
  app.use('/api/playrooms', Playrooms)
}

export default createRoutes
