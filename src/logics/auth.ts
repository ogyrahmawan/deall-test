import moment from 'moment';
import config from 'config';
import { errors } from '../helper';
import { compare } from '../helper/bcrypt';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
} from '../helper/jwt';
import { LoginPayloadType } from '../types/auth';
import { RoleRepository, UserRepository, UserTokenRepository } from '../data/repository';
import { ObjectId } from 'mongodb';

const createUserToken = async (
    idUser: ObjectId,
    refreshToken: string,
) => {
    const expiresIn = `${config.get('jwtOption.refreshTokenOption.expiresIn')}`;
    const expired = expiresIn.split(' ');
    const units: any = expired[1];

    const expiredAt = moment()
        .utc()
        .add(expired[0], units)
        .format('YYYY-MM-DD HH:mm:ss');

    const data = {
        user_id: idUser,
        refresh_token: refreshToken,
        expires_at: expiredAt,
    };

    await UserTokenRepository.upsertData(data);
};

const login = async (data: LoginPayloadType) => {
    const existUser = await UserRepository.findByUsername(data.username);
    if (!existUser) throw new errors.internalError.InvalidEmailOrPasswordError(null);

    const roleData = await RoleRepository.findById(existUser.role_id);
    // check password
    const decode = compare(data.password, existUser?.password);
    if (!decode) throw new errors.internalError.Forbidden('wrong username / password', null);

    const userData = {
        user_id: existUser?._id,
        username: existUser?.username,
        role_id: existUser?.role_id,
        role_name: roleData?.name,
    };

    const accessToken = generateAccessToken(userData);
    const refreshToken = generateRefreshToken(userData);

    const result = {
        accessToken,
        refreshToken,
    };

    await createUserToken(userData.user_id, refreshToken);
    
    return result;
};


const renewAccessToken = async (headers: any) => {
    const token = headers.refresh_token;
    const userToken = await UserTokenRepository.findByRefreshToken(token);
    if (!userToken) throw new errors.internalError.UnauthorizedError();
    const userData = await verifyRefreshToken(userToken.refresh_token);

    const existUserData = await UserRepository.findById(userToken._id);
    if (!existUserData) throw new errors.internalError.ResourceNotFoundError('user');

    const roleData = await RoleRepository.findById(existUserData.role_id);
    if (!roleData) throw new errors.internalError.ResourceNotFoundError('role');

    const user = {
        user_id: userToken._id,
        username: existUserData.username,
        role_id: roleData._id,
        role_name: roleData.name,
    };

    const accessToken = generateAccessToken(user);

    const result = {
        accessToken,
        refreshToken: token,
    };
    return result;
};

export {
    login,
    renewAccessToken,
    createUserToken,
};
