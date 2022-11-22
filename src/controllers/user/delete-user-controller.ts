import { Request, Response } from 'express';
import {
    errors, responses, utilities, validator,
} from '../../helper';
import { userLogic } from '../../logics';

const index = async (req: Request, res: Response) => {
    const { params } = req;

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

    const resp = await userLogic.deleteUser(params.id);

    responses.httpResponse.ok(res, 'Successfully create user', resp);
};

export default utilities.controllerWrapper(index);
