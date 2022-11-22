import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import {
    utilities, responses,
} from '../../helper';
import { userLogic } from '../../logics';
import user from '../../routes/user';
import { IGetUserAuthInfoRequest } from '../../types/auth';

const index = async (req : IGetUserAuthInfoRequest, res : Response) => {
    const { params, user } = req;
    const id = new ObjectId(params.id);
    const result = await userLogic.getDetailUser(id, user);
    return responses.httpResponse.ok(res, 'Success get detail user', result);
};

export default utilities.controllerWrapper(index);
