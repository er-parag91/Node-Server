const request = require('supertest');
const app = require('../src/app');

const Task = require('../src/models/task');
const { userOneID, userOne, setupDatabase } = require('./fixtures/db.js');

beforeEach(setupDatabase);

test('should create a task(with default value for completed since it is not provided) when authenticated', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'Buy a grocery'
        })
        .expect(201);

        const task = await Task.findById(response.body._id);
        expect(task).not.toBeNull();

        expect(task.completed).toBe(false)
});