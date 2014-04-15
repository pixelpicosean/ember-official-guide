window.addEventListener('load', function() { 'use strict';

    var Todos = window.Todos = Ember.Application.create();

    Todos.Router.map(function() {
        this.resource('todos', { path: '/' });
    });

    Todos.IndexRoute = Ember.Route.extend({});

    Todos.Todo = DS.Model.extend({
        title: DS.attr('string'),
        isCompleted: DS.attr('boolean')
    });

});
