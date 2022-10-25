import { CommonRoutesConfig } from "../common/common.routes.config";
import express from 'express';
import UsersController from "./controllers/users.controller";
import UsersMiddleware from "./middleware/users.middleware";
import bodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import { body } from 'express-validator';
import jwtMiddleware from "../auth/middleware/jwt.middleware";
import { PermissionFlags } from "../common/middleware/common.permissionflag.enum";
import permissionMiddleware from "../common/middleware/ common.permission.middleware";


export class UsersRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UsersRoutes');
    }

    configureRoutes(): express.Application {
        this.app
            .route('/users')
            .get(
                jwtMiddleware.validJWTNeeded,
                permissionMiddleware.permissionFlagRequired(
                    PermissionFlags.ADMIN_PERMISSION
                ),
                UsersController.listUsers
            )
            .post(
                body('email').isEmail(),
                body('password')
                    .isLength({ min: 5 })
                    .withMessage('Must include password (5+ characters)'),
                bodyValidationMiddleware.verifyBodyFieldsErrors,
                UsersMiddleware.validateSameEmailDoesntExist,
                UsersController.createtUser
            );
        
        this.app.param('userId', UsersMiddleware.extractUserId);
        this.app
            .route('/users/:userId')
            .all(
                UsersMiddleware.validateUserExists,
                jwtMiddleware.validJWTNeeded,
                permissionMiddleware.onlySameUserOrAdminCanDoThisAction
            )
            .get(UsersController.getUserById)
            .delete(UsersController.removeUser);
        
        this.app.put('/users/:userId', [
            body('email').isEmail(),
            body('password')
                .isLength({ min: 5 })
                .withMessage('Must include password (5+ characters)'),
            body('firstName').isString(),
            body('lastName').isString(),
            body('permissionFlag').isInt(),
            bodyValidationMiddleware.verifyBodyFieldsErrors,
            UsersMiddleware.validateSameEmailBelongtoSameUser,
            UsersMiddleware.userCantChangePermission,
            permissionMiddleware.permissionFlagRequired(
                PermissionFlags.PAID_PERMISSION
            ),
            UsersController.put,
        ]);

        this.app.patch('/users/:userId', [
            body('email').isEmail().optional(),
            body('password')
                .isLength({ min: 5 })
                .withMessage('Must include password (5+ characters)')
                .optional(),
            body('firstName').isString().optional(),
            body('lastName').isString().optional(),
            body('permissionFlag').isInt().optional(),
            bodyValidationMiddleware.verifyBodyFieldsErrors,
            UsersMiddleware.validatePatchEmail,
            UsersMiddleware.userCantChangePermission,
            permissionMiddleware.permissionFlagRequired(
                PermissionFlags.PAID_PERMISSION
            ),
            UsersController.patch,
        ]);

        this.app.put('/users/:userId/permissionFlags/:permissionFlags', [
            jwtMiddleware.validJWTNeeded,
            permissionMiddleware.onlySameUserOrAdminCanDoThisAction,
            permissionMiddleware.permissionFlagRequired(
                PermissionFlags.FREE_PERMISSION
            ),
            UsersController.updatePermissionFlags,
        ])

        return this.app;
    }
}