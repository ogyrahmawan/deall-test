import { Request, Response } from 'express';
import {
    utilities, responses,
} from '../../helper';
import { userLogic } from '../../logics';
import { IGetUserAuthInfoRequest } from '../../types/auth';

const index = async (req : IGetUserAuthInfoRequest, res : Response) => {
    const result = await userLogic.getListUser();
    return responses.httpResponse.ok(res, 'Success get list user', result);
};

export default utilities.controllerWrapper(index);
