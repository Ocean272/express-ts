
import mongooseService from "../../common/services/mongoose.services";
import shortid from "shortid";
import debug from "debug";
import { CreateUserDto } from "../dto/create.user.dto";
import { PutUserDto } from "../dto/put.user.dto";
import { PatchUserDto } from "../dto/patch.user.dto";
import { PermissionFlags } from "../../common/middleware/common.permissionflag.enum";

const log: debug.IDebugger = debug('app:in-memory-dao');

class UsersDao {
    
    Schema = mongooseService.getMongoose().Schema;

    userSchema = new this.Schema({
        _id: String,
        email: String,
        firstName: String,
        lastName: String,
        permissionFlags: Number,
        password: { type: String, select: false },
    }, { id: false });
    
    User = mongooseService.getMongoose().model('Users', this.userSchema);

    constructor() {
        log('Created new instance of UsersDao');
    }

    async addUser(userFields: CreateUserDto) {
        const userId = shortid.generate();
        const user = new this.User({
            _id: userId,
            ...userFields,
            permissionFlags: PermissionFlags.FREE_PERMISSION,
        });
        await user.save();
        return userId;
    }

    async getUsers(limit =25, page = 0) {
        return this.User.find()
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async getUserById(userId: string) {
        return this.User
            .findOne({ _id: userId })
            .exec();
    }

    async getUserByEmail(email: string) {
        return this.User
            .findOne({ email: email })
            .exec();
    }

    async getUserByEmailWithPassword(email: string) {
        return this.User
            .findOne({ email: email })
            .select('_id email permissionFlags +password')
            .exec();
    }

    async removeUserById(userId: string) {
        return this.User.deleteOne({ _id: userId}).exec();
    }

    async updateUserById(
        userId: String,
        userFields: PutUserDto | PatchUserDto
    ) {
        const existingUser = await this.User.findOneAndUpdate(
            { _id: userId },
            { $set: userFields },
            { new: true}
        ).exec();

        return existingUser;
    }

}

export default new UsersDao();