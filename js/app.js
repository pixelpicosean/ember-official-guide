window.addEventListener('load', function() { 'use strict';

    var Todos = window.Todos = Ember.Application.create();

    // Routes -----------------------------------------------
    Todos.Router.map(function() {
        this.resource('todos', { path: '/' });
    });

    Todos.IndexRoute = Ember.Route.extend({});

    // Model ------------------------------------------------
    Todos.Todo = DS.Model.extend({
        title: DS.attr('string'),
        isCompleted: DS.attr('boolean')
    });

    // Fixtures ---------------------------------------------
    Todos.Todo.FIXTRES = [
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
