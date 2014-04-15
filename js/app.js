window.addEventListener('load', function() { 'use strict';

    var Todos = window.Todos = Ember.Application.create();
    Todos.ApplicationAdapter = DS.FixtureAdapter.extend();

    // Routes -----------------------------------------------
    Todos.Router.map(function() {
        this.resource('todos', { path: '/' });
    });

    Todos.TodosRoute = Ember.Route.extend({
        model: function() {
            return this.store.find('todo');
        }
    });

    // Model ------------------------------------------------
    Todos.Todo = DS.Model.extend({
        title: DS.attr('string'),
        isCompleted: DS.attr('boolean')
    });

    // Fixtures ---------------------------------------------
    Todos.Todo.FIXTURES = [
        {
            id: 1,
            title: 'Learn Ember.js',
            isCompleted: true
        },
        {
            id: 2,
            title: '...',
            isCompleted: false
        },
        {
            id: 3,
            title: 'Profit!',
            isCompleted: false
        }
    ];

});
