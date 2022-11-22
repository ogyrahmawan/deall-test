import { Router } from 'express';
import { authController } from '../controllers';

export default (routes: Router) => {
    routes.post(
        '/login',
        authController.postLoginController,
    );

    routes.patch(
        '/renew-refresh-token',
        authController.patchRenewAccessToken,
    );
};
