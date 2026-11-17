const { app } = require('@azure/functions');

let todos = [
  { id: 1, task: 'test 1' },
  { id: 2, task: 'test 2' }
];

// GET /todos
app.http('getTodos', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'todos',
  handler: async (request, context) => {
    context.log('GET /todos called');
    return { jsonBody: todos };
  }
});

// POST /todos
app.http('createTodo', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'todos',
  handler: async (request, context) => {
    const body = await request.json();
    const todo = { id: todos.length + 1, task: body.task };
    todos.push(todo);
    context.log(`Created todo id=${todo.id}`);
    return { status: 201, jsonBody: todo };
  }
});

// DELETE /todos/{id}
app.http('deleteTodo', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'todos/{id}',
  handler: async (request, context) => {
    const id = parseInt(request.params.id);
    const before = todos.length;
    todos = todos.filter(t => t.id !== id);
    context.log(`Deleted todo id=${id}, remaining=${todos.length}`);
    if (todos.length === before) {
      return { status: 404, jsonBody: { message: 'Not found' } };
    }
    return { jsonBody: { message: 'Deleted' } };
  }
});