import { Response, Request } from "express"
import { errors, responses, utilities, validator } from "../../helper";
import { authLogic } from "../../logics";

const login = async (req: Request, res: Response) => {
    const { headers } = req;
    
    const errorValidator = [];
    const errs: any = [];

    errorValidator.push(
        validator.required(headers, 'authorization', 'header'),
    );
    errorValidator.push(validator.string(headers, 'authorization', 'header'));

    errorValidator.forEach((each) => {
        if (each.error) errs.push(each.error);
    });

    if (errs.length > 0) throw errors.httpError.badRequest(errs);

    if (headers.authorization) {
        const [username, password] = Buffer.from(headers.authorization.split(' ')[1] || '', 'base64').toString().split(':');
        const data = { username, password };
        const response = await authLogic.login(data);
        return responses.httpResponse.ok(res, 'Success login', response);
    }
};

export default utilities.controllerWrapper(login);
