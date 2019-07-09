const request = require('supertest');
const app = require('../src/app');

const Task = require('../src/models/task');
const { userOneID, userOne, userTwo, taskOne, taskTwo, taskThree, setupDatabase } = require('./fixtures/db.js');

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


test('should fetch all the task created by respective specific user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(200);

    expect(response.body.length).toBe(2)
});

test('should delete the task if owner who created task deletes it', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskThree._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(200)
    
    const task = await Task.findById(response.body._id);
    expect(task).toBeNull();

});

test('should delete the task if owner who created task deletes it', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskTwo._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(404);
    
    // task should still be present in database
    const task = await Task.findById(taskTwo._id);
    expect(task).not.toBeNull();
});