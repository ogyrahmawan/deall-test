import { user } from '../data/entity';
import { UserStorePayload } from '../data/entity/user';
import { RoleRepository, UserRepository } from '../data/repository';
import { bcrypt, errors } from '../helper';
import { RoleName } from '../variable';

const userSeed = async () => {
    try {
        // get admin role id
        const adminRole = await RoleRepository.findByName(RoleName.Admin); 
        if (!adminRole) throw new errors.internalError.ResourceNotFoundError('admin role');
        const password = bcrypt.hash('d3All123')
        const newUser: UserStorePayload = {
            username: 'ogyrahmawan',
            password,
            role_id: adminRole._id,
        }
        // check by username if user is exist or not
        const existUser = await UserRepository.findByUsername(newUser.username);
        if (!existUser) {
            // get admin role
            await UserRepository.createData(newUser);
        }
    } catch (error) {
        throw error
    }
}

export default userSeed;
