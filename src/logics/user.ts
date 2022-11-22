import { ObjectId } from "mongodb";
import { user } from "../data/entity"
import { UserBodyRequest, UserStorePayload, UserUpdateBodyRequest, UserUpdatePaylod } from "../data/entity/user";
import { RoleRepository, UserRepository } from "../data/repository"
import User from "../data/repository/user";
import { errors, utilities } from "../helper";
import { hash } from "../helper/bcrypt";
import { LoggedInUser } from "../types/auth";
import { RoleName } from "../variable";

const getListUser = async () => {
    const users = await UserRepository.find();
    return users;
}

const getDetailUser = async (idUser: ObjectId, user: LoggedInUser) => {
    // get logged in user data
    const loggedInUserData = await UserRepository.findById(new ObjectId(user.user_id));
    if (!loggedInUserData) throw new errors.internalError.UnauthorizedError();
    
    const userData = await UserRepository.findDetail(idUser);
    if (!userData) throw new errors.internalError.ResourceNotFoundError('user');
    const userDetail = userData[0]

    // if logged user is user, check user data is their data or not
    if (!idUser.equals(loggedInUserData._id)) throw new errors.internalError.Forbidden();
    return userDetail;
}

const createUser = async (body: UserBodyRequest) => {
    // check if role id is exist
    const existRole = await RoleRepository.findById(new ObjectId(body.role_id));
    if (!existRole) throw new errors.internalError.ResourceNotFoundError('role');

    // check user already exist or not
    const existUsername = await UserRepository.findByUsername(body.username);
    if (existUsername) throw new errors.internalError.AlreadyUsedError('Username');

    // check password
    if (!utilities.validatePassword(body.password)) throw new errors.internalError.InvalidPasswordRequirment(null);
    const payload: UserStorePayload = {
        username: body.username,
        password: hash(body.password),
        role_id: new ObjectId(body.role_id),
    }
    await UserRepository.createData(payload);
    return {
        username: body.username,
        role: existRole.name,
    }
}

const updateUser = async (data: UserUpdateBodyRequest, userId: string,loggedInUser: LoggedInUser) => {
    // get logged in user data
    const loggedInUserData = await UserRepository.findById(new ObjectId(loggedInUser.user_id));
    if (!loggedInUserData) throw new errors.internalError.UnauthorizedError();
    console.log(loggedInUserData, 'isi logged in user data')
    console.log(userId)
    // check targeted user
    const userData = await UserRepository.findById(new ObjectId(userId));
    console.log(userData, 'isi user data')
    if (!userData) throw new errors.internalError.ResourceNotFoundError('user');
    if (loggedInUser.role_name === RoleName.User) {
        if (!userData._id.equals(loggedInUserData._id)) throw new errors.internalError.Forbidden();
    }
    // prepare payload
    const updatePayload: UserUpdatePaylod = {}

    // check if updating password, is password valid or not
    if (data.password) {
        if (!utilities.validatePassword(data.password)) throw new errors.internalError.InvalidPasswordRequirment(null);
        updatePayload.password = hash(data.password);
    }

    // chefck if updating username, username is already used or not
    if (data.username) {
        // check user already exist or not
        const existUsername = await UserRepository.findByUsername(data.username);
        if (existUsername) throw new errors.internalError.AlreadyUsedError('Username');
        updatePayload.username = data.username;
    }
    if (data.role_id) {
        updatePayload.role_id = new ObjectId(data.role_id);
    }
    await UserRepository.upsertData(updatePayload, userData._id)
};

const deleteUser = async (id: string) => {
    const userObjectId = new ObjectId(id); 
    // check user is alread exist or not
    const existUser = await UserRepository.findById(userObjectId);
    if (!existUser) throw new errors.internalError.ResourceNotFoundError('user');

    await UserRepository.deleteData(userObjectId);
    
};
export {
    getListUser,
    getDetailUser,
    createUser,
    updateUser,
    deleteUser,
}