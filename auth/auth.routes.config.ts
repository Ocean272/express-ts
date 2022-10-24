import { CommonRoutesConfig } from "../common/common.routes.config";
import authController from "./controllers/auth.controller";
import authMiddleware from "./middleware/auth.middleware";
import express from 'express';
import bodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import {body} from 'express-validator';
import jwtMiddleware from "./middleware/jwt.middleware";

export class AuthRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'AuthRoutes');
    }

    configureRoutes(): express.Application {
        this.app.post('/auth', [
            body('email').isEmail(),
            body('password').isString(),
            bodyValidationMiddleware.verifyBodyFieldsErrors,
            authMiddleware.verifyUserPassword,
            authController.createJWT,
        ]);

        this.app.post('/auth/refresh-token', [
            jwtMiddleware.validJWTNeeded,
            jwtMiddleware.verifyRefreshBodyField,
            jwtMiddleware.ValidRefreshNeeded,
            authController.createJWT,
        ]);
        
        return this.app;


    }

}