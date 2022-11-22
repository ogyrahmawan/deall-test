import { role } from '../data/entity';
import { RoleStorePayload } from '../data/entity/role';
import { RoleRepository } from '../data/repository';

const initRole: RoleStorePayload[] = [
    {
        name: 'Admin'
    },
    {
        name: 'User'
    }
]

const roleSeed = async () => {
    try {
        const roleQuery = initRole.map(async (role) => {
            // check by role name if role is exist or not
            const existRole = await RoleRepository.findByName(role.name);
            if (!existRole) {
                await RoleRepository.createData(role);
            }
        })
        await Promise.all(roleQuery);
    } catch (error) {
        throw error;
    }
}

export default roleSeed;
