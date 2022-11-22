import { Router } from 'express';
import auth from './auth';
import user from './user';

const routes = Router()
auth(routes);
user(routes);

export default routes;