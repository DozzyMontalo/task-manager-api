// afterAll(() => mongoose.connection.close())
// const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId, userOne, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('should signup a new user', async() => {
    const response = await request(app).post('/users')
    .send({
        name: 'Bianca Benard',
        email: 'bianca@gmail.com',
        password: 'stars3045?'
    }).expect(201)

    //Assert that the database was changed correctly
const user = await User.findById(response.body.user._id)
expect(user).not.toBeNull()

//Assertions about the response
expect(response.body).toMatchObject({
    user: {
        name: 'Bianca Benard',
        email: 'bianca@gmail.com'
    },
    token: user.tokens[0].token
 })
  expect(user.password).not.toBe('stars3045?')
})

test('should login existing user', async () => {
     const response = await request(app).post('/users/login')
     .send ({
     email: userOne.email,
     password: userOne.password
  }).expect(200)

  const user = await User.findById(userOneId)

  expect(response.body.token).toBe(user.tokens[1].token)
})

test('should not login nonexistent user', async () => {
    if(!userOne){
        await request(app).post('/users/login').send ({
            email: userOne.email,
            password: userOne.password
         }).expect(400)
    }
})

test('should get profile for user', async () =>{
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('should not get profile for unauthenticated user', async () => {
    await request(app)
         .get('/users/me')
         .send()
         .expect(401)
})

test('should delete account for user', async () => {
    await request(app)
          .delete('/users/me')
          .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
          .send()
          .expect(200)
        const user = await User.findById(userOneId)
        expect(user).toBeNull()
})

test('should not delete account for unauthenticated user', async () => {
    await request(app)
          .delete('/users/me')
          .send()
          .expect(401)
})

test('should upload avatar image', async () => {
    await request(app)
          .post('/users/me/avatar')
          .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
          .attach('avatar', 'tests/fixtures/profile-pic.jpg')
          .expect(200)
          const user = await User.findById(userOneId)
          expect(user.avatar).toEqual(expect.any(Buffer))
})

test('should update a valid user fields', async () => {
     await request(app)
     .patch('/users/me')
     .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
     .send({name : 'Papaya'})
     .expect(200)
     const user = await User.findById(userOneId)
     expect(user.name).toEqual('Papaya')

})

test('should not update invalid user fields', async () => {
   await request (app)
   .patch('/users/me')
   .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
   .send({address : '5 bowen street'})
   .expect(400)
})

