import { Request, Response } from 'express';
import {
    errors, responses, utilities, validator,
} from '../../helper';
import { userLogic } from '../../logics';
import { IGetUserAuthInfoRequest } from '../../types/auth';

const index = async (req: IGetUserAuthInfoRequest, res: Response) => {
    const { body, user, params } = req;

    const errorValidator : any = [];
    const errs : any = [];

    errorValidator.push(validator.required(params, 'id'));
    errorValidator.push(validator.string(params, 'id'));

    if (params.id === ':id') {
        throw new errors.internalError.InCompleteKeyError('id parameter');
    }

    errorValidator.forEach((each : any) => {
        if (each.error) errs.push(each.error);
    });

    if (errs.length > 0) throw errors.httpError.badRequest(errs);

    const resp = await userLogic.updateUser(body, params.id, user);

    responses.httpResponse.ok(res, 'Successfully update user', resp);
};

export default utilities.controllerWrapper(index);
