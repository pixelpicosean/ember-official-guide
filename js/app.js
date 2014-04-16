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

    // Controller -------------------------------------------
    Todos.TodosController = Ember.ArrayController.extend({
        // Properties
        remaining: function() {
            return this.filterBy('isCompleted', false).get('length');
        }.property('@each.isCompleted'),
        inflection: function() {
            return (this.get('remaining') === 1) ? 'item' : 'items';
        }.property('remaining'),

        // Actions
        actions: {
            createTodo: function() {
                // Get the todo title set by the "New Todo" text field
                var title = this.get('newTitle');
                if (!title.trim()) { return; }

                // Create the new Todo model
                var todo = this.store.createRecord('todo', {
                    title: title,
                    isCompleted: false
                });

                // Clear the "New Todo" text field
                this.set('newTitle', '');

                // Save the new model
                todo.save();
            }
        }
    });

    Todos.TodoController = Ember.ObjectController.extend({
        isEditing: false,
        isCompleted: function(key, value) {
            var model = this.get('model');

            if (value === undefined) {
                // Property being used as a getter
                return model.get('isCompleted');
            }
            else {
                // Property being used as a setter
                model.set('isCompleted', value);
                model.save();
                return value;
            }
        }.property('model.isCompleted'),
        actions: {
            editTodo: function() {
                this.set('isEditing', true);
            }
        }
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
