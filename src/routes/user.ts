import { Router } from 'express';
import { userController } from '../controllers';
import { authMiddleware } from '../middleware';

export default (routes: Router) => {
    routes.get(
        '/user',
        authMiddleware.closedAuth,
        authMiddleware.onlyAdmin,
        userController.getListUsersController,
    );

    routes.post(
        '/user',
        authMiddleware.closedAuth,
        authMiddleware.onlyAdmin,
        userController.postCreateUserController,
    );

    routes.patch(
        '/user/:id',
        authMiddleware.closedAuth,
        authMiddleware.onlyAdmin,
        userController.patchUpdateUserController,
    );

    routes.get(
        '/user/:id',
        authMiddleware.closedAuth,
        userController.getDetailUserController,
    );

    routes.delete(
        '/user/:id',
        authMiddleware.closedAuth,
        authMiddleware.onlyAdmin,
        userController.deleteUserController,
    );
};
