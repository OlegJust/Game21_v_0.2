import bodyParser from "body-parser";
import express from "express";

import AuthorizationCtrl from "../routes/auth.routes";

const createRoutes = (app: express.Express) => {
	//const AuthorizationController = new AuthorizationCtrl(io);
	//const AuthorizationController = new AuthorizationCtrl();

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}))

	app.get("/api/", (_: express.Request, res: express.Response) => {
    res.status(201).json({ message: 'Hello world' });
  });

		app.use('/api/auth', AuthorizationCtrl)
		app.use('/api/playrooms', require('../routes/playrooms.routes'))
  // app.post('/auth/register', AuthorizationController.register)
	// app.get('/auth/login', AuthorizationController.login)
};

export default createRoutes;