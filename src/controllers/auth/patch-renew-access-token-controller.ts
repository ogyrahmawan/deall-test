import { Request, Response } from 'express';
import {
    utilities, responses, validator, errors,
} from '../../helper';
import { authLogic } from '../../logics';

const postRenewAccessTokenController = async (req: Request, res: Response) => {
    const { headers } = req;

    const errorValidator = [];
    const errs: any = [];

    errorValidator.push(
        validator.required(headers, 'refresh_token', 'headers'),
    );
    errorValidator.push(validator.string(headers, 'refresh_token', 'header'));

    errorValidator.forEach((each) => {
        if (each.error) errs.push(each.error);
    });

    if (errs.length > 0) throw errors.httpError.badRequest(errs);

    const response = await authLogic.renewAccessToken(headers);

    responses.httpResponse.ok(res, 'Successfully renew access token', response);
};

export default utilities.controllerWrapper(postRenewAccessTokenController);
