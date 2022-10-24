"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../../app"));
const supertest_1 = __importDefault(require("supertest"));
const chai_1 = require("chai");
const shortid_1 = __importDefault(require("shortid"));
const mongoose_1 = __importDefault(require("mongoose"));
let firstUserIdTest = "";
const firstUserBody = {
    email: `marcos.henrique+${shortid_1.default.generate()}@toptal.com`,
    password: 'Sup3rSecret!23'
};
let accessToken = "";
let refreshToken = "";
const newFirstName = "Jose";
const newFirstName2 = "Paulo";
const newLastName2 = "Faraco";
describe('users and auth endpoints', function () {
    let request;
    before(function () {
        request = supertest_1.default.agent(app_1.default);
    });
    it('should allow a POST to /users', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield request.post('/users').send(firstUserBody);
            (0, chai_1.expect)(res.status).to.equal(201);
            (0, chai_1.expect)(res.body).not.to.be.empty;
            (0, chai_1.expect)(res.body).to.be.an('object');
            (0, chai_1.expect)(res.body.id).to.be.a('string');
            firstUserIdTest = res.body.id;
        });
    });
    it('should allow a POST to /auth', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield request.post('/auth').send(firstUserBody);
            (0, chai_1.expect)(res.status).to.equal(201);
            (0, chai_1.expect)(res.body).not.to.be.empty;
            (0, chai_1.expect)(res.body).to.be.an('object');
            (0, chai_1.expect)(res.body.accessToken).to.be.a('string');
            accessToken = res.body.accessToken;
            refreshToken = res.body.refreshToken;
        });
    });
    it('should allow a GET from /users/:userId with an access token', function () {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield request
                .get(`/users/${firstUserIdTest}`)
                .set({ Authorization: `Bearer ${accessToken}` })
                .send();
            (0, chai_1.expect)(res.status).to.be.equal(200);
            (0, chai_1.expect)(res.body).not.to.be.empty;
            (0, chai_1.expect)(res.body).to.be.an('object');
            (0, chai_1.expect)(res.body._id).to.be.a('string');
            (0, chai_1.expect)(res.body._id).to.be.equal(firstUserIdTest);
            (0, chai_1.expect)(res.body.email).to.equal(firstUserBody.email);
        });
    });
    describe('with a valid access token', function () {
        it('should disallow a GET from /users', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield request
                    .get('/users')
                    .set({ Authorization: `Bearer ${accessToken}` })
                    .send();
                (0, chai_1.expect)(res.status).to.equal(403); //initially was (403)
            });
        });
        it('should disallow a PATCH to /users/:userId', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield request
                    .patch(`/users/${firstUserIdTest}`)
                    .set({ Authorization: `Bearer ${accessToken}` })
                    .send({
                    firstName: newFirstName,
                });
                (0, chai_1.expect)(res.status).to.be.equal(403);
            });
        });
        it('should disallow a PUT to /users/:userId with an nonexistent ID', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield request
                    .put(`/users/i-do-not-exist`)
                    .set({ Authorization: `Bearer ${accessToken}` })
                    .send({
                    email: firstUserBody.email,
                    password: firstUserBody.password,
                    firstName: 'Marcos',
                    lastName: 'Silva',
                    permissionFlag: 256,
                });
                (0, chai_1.expect)(res.status).to.equal(404);
            });
        });
        it('should disallow a PUT to /users/:userId trying to change the permission flags', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield request
                    .put(`/users/${firstUserIdTest}`)
                    .set({ Authorization: `Bearer ${accessToken}` })
                    .send({
                    email: firstUserBody.email,
                    password: firstUserBody.password,
                    firstName: 'Marcos',
                    lastName: 'Silva',
                    permissionFlag: 256,
                });
                (0, chai_1.expect)(res.status).to.equal(400);
                (0, chai_1.expect)(res.body.errors).to.be.an('array');
                (0, chai_1.expect)(res.body.errors).to.have.length(1);
                (0, chai_1.expect)(res.body.errors[0]).to.equal('User cannot change permission flags');
            });
        });
        it('should allow a PUT to /users/:userId/permissionFlags/2 for testing', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield request
                    .put(`/users/${firstUserIdTest}/permissionFlags/2`)
                    .set({ Authorization: `Bearer ${accessToken}` })
                    .send({});
                (0, chai_1.expect)(res.status).to.be.equal(204);
            });
        });
        describe('with a new set of permission flags', function () {
            it('should allow a POST /auth/refresh-token', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const res = yield request
                        .post('/auth/refresh-token')
                        .set({ Authorization: `Bearer ${accessToken}` })
                        .send({ refreshToken });
                    (0, chai_1.expect)(res.status).to.be.equal(201);
                    (0, chai_1.expect)(res.body).not.to.be.empty;
                    (0, chai_1.expect)(res.body).to.be.an('object');
                    (0, chai_1.expect)(res.body.accessToken).to.be.a('string');
                    accessToken = res.body.accessToken;
                    refreshToken = res.body.refreshToken;
                });
            });
            it('should allow a PUT to /users/:userId to change first and last names', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const res = yield request
                        .put(`/users/${firstUserIdTest}`)
                        .set({ Authorization: `Bearer ${accessToken}` })
                        .send({
                        email: firstUserBody.email,
                        password: firstUserBody.password,
                        firstName: newFirstName,
                        lastName: newLastName2,
                        permissionFlags: 256
                    });
                    (0, chai_1.expect)(res.status).to.equal(204);
                });
            });
            it('should allow a GET from /users/:userId and should have a new full name', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const res = yield request
                        .get(`/users/${firstUserIdTest}`)
                        .set({ Authorization: `Bearer ${accessToken}` })
                        .send();
                    (0, chai_1.expect)(res.status).to.equal(200);
                    (0, chai_1.expect)(res.body).not.to.be.empty;
                    (0, chai_1.expect)(res.body).to.be.an('object');
                    (0, chai_1.expect)(res.body._id).to.be.a('string');
                    (0, chai_1.expect)(res.body.firstName).to.be.equal(newFirstName2);
                    (0, chai_1.expect)(res.body.lastName).to.be.equal(newLastName2);
                    (0, chai_1.expect)(res.body.email).to.be.equal(firstUserBody.email);
                    (0, chai_1.expect)(res.body._id).to.be.equal(firstUserIdTest);
                });
            });
            it('should allow a DELETE from /users/:userId', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const res = yield request
                        .delete(`/users/${firstUserIdTest}`)
                        .set({ Authorization: `Bearer ${accessToken}` })
                        .send();
                    (0, chai_1.expect)(res.status).to.be.equal(204);
                });
            });
        });
    });
    after(function (done) {
        // shut down the Express.js server, close our MongoDB connection, then
        // tell Mocha we're done:
        app_1.default.listen(() => {
            mongoose_1.default.connection.close(done);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3QvdXNlcnMvdXNlcnMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLG9EQUE0QjtBQUM1QiwwREFBa0M7QUFDbEMsK0JBQThCO0FBQzlCLHNEQUE4QjtBQUM5Qix3REFBZ0M7QUFHaEMsSUFBSSxlQUFlLEdBQUcsRUFBRSxDQUFDO0FBQ3pCLE1BQU0sYUFBYSxHQUFHO0lBQ2xCLEtBQUssRUFBRSxtQkFBbUIsaUJBQU8sQ0FBQyxRQUFRLEVBQUUsYUFBYTtJQUN6RCxRQUFRLEVBQUUsZ0JBQWdCO0NBQzdCLENBQUE7QUFFRCxJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDckIsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQztBQUM1QixNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUM7QUFDOUIsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDO0FBRTlCLFFBQVEsQ0FBQywwQkFBMEIsRUFBRTtJQUNqQyxJQUFJLE9BQWlDLENBQUM7SUFDdEMsTUFBTSxDQUFDO1FBQ0gsT0FBTyxHQUFHLG1CQUFTLENBQUMsS0FBSyxDQUFDLGFBQUcsQ0FBQyxDQUFDO0lBQ25DLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLCtCQUErQixFQUFFOztZQUNoQyxNQUFNLEdBQUcsR0FBRyxNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRTdELElBQUEsYUFBTSxFQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pDLElBQUEsYUFBTSxFQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxL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