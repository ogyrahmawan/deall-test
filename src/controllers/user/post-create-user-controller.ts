import { Request, Response } from 'express';
import {
    errors, responses, utilities, validator,
} from '../../helper';
import { userLogic } from '../../logics';

const index = async (req: Request, res: Response) => {
    const { body } = req;

    const errorValidator : any = [];
    const errs : any = [];

    errorValidator.push(validator.required(body, 'username'));
    errorValidator.push(validator.string(body, 'username'));

    errorValidator.push(validator.required(body, 'password'));
    errorValidator.push(validator.string(body, 'password'));

    errorValidator.push(validator.required(body, 'role_id'));
    errorValidator.push(validator.string(body, 'role_id'));

    errorValidator.forEach((each : any) => {
        if (each.error) errs.push(each.error);
    });

    if (errs.length > 0) throw errors.httpError.badRequest(errs);

    const resp = await userLogic.createUser(body);

    responses.httpResponse.ok(res, 'Successfully create user', resp);
};

export default utilities.controllerWrapper(index);
