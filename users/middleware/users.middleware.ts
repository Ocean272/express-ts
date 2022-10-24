import express from 'express';
import usersService from '../services/users.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:users-controller');

class UsersMiddleware {
    // async validateRequiredUserBodyFields (
    //     req: express.Request,
    //     res: express.Response,
    //     next: express.NextFunction
    // ) {
    //     if(req.body && req.body.email && req.body.password) {
    //         next();
    //     } else {
    //         res.status(400).send({
    //             error: 'Missing required fields email and password',
    //         });
    //     }
    // }

    async validateSameEmailDoesntExist (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await usersService.getUserByEmail(req.body.email)
        if(user) {
            res.status(400).send({ errors: 'User email already exists.' });
        } else {
            next();
        };
    }

    async validateSameEmailBelongtoSameUser (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if(res.locals.user._id === req.params.userId) {
            next();
        } else {
            res.status(400).send({ errors: ['Invalid email'] });
        };
    }

    validatePatchEmail = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        if (req.body.email){
            this.validateSameEmailBelongtoSameUser(req, res, next);
        } else {
            next();
        } 
    };

    async userCantChangePermission(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (
            'permissionFlags' in req.body &&
            req.body.permissionFlags !== res.locals.user.permissionFlags
        ) {
            res.status(400).send({
                errors: ['User cannot change permission flags']
            });
        } else {
            next();
        }
    }

    async validateUserExists (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await usersService.readById(req.params.userId)
        if(user) {
            res.locals.user = user;
            next();
        } else {
            res.status(404).send({ errors: `User ${req.params.userId} not found` });
        };
    }
    
    async extractUserId (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.userId;
        next();
    }
}

export default new UsersMiddleware();