window.addEventListener('load', function() { 'use strict';

    var Todos = window.Todos = Ember.Application.create();
    Todos.ApplicationAdapter = DS.LSAdapter.extend({
        namespace: 'todos-emberjs'
    });

    // Routes -----------------------------------------------
    Todos.Router.map(function() {
        this.resource('todos', { path: '/' }, function() {
            // Add this function to disable default index
            // routes which enables "TodosIndexRoute"
            this.route('active');
            this.route('completed');
        });
    });

    Todos.TodosRoute = Ember.Route.extend({
        model: function() {
            return this.store.find('todo');
        }
    });

    Todos.TodosIndexRoute = Ember.Route.extend({
        model: function() {
            return this.modelFor('todos');
        }
    });

    Todos.TodosActiveRoute = Ember.Route.extend({
        model: function() {
            return this.store.filter('todo', function(todo) {
                return !todo.get('isCompleted');
            });
        },
        renderTemplate: function(controller) {
            this.render('todos/index', {
                controller: controller
            });
        }
    });

    Todos.TodosCompletedRoute = Ember.Route.extend({
        model: function() {
            return this.store.filter('todo', function(todo) {
                return todo.get('isCompleted');
            });
        },
        renderTemplate: function(controller) {
            this.render('todos/index', {
                controller: controller
            });
        }
    });

    // Model ------------------------------------------------
    Todos.Todo = DS.Model.extend({
        title: DS.attr('string'),
        isCompleted: DS.attr('boolean')
    });

    // View -------------------------------------------------
    Todos.EditTodoView = Ember.TextField.extend({
        didInsertElement: function() {
            this.$().focus();
        }
    });
    Ember.Handlebars.helper('edit-todo', Todos.EditTodoView);


    // Controller -------------------------------------------
    Todos.TodosController = Ember.ArrayController.extend({
        // Properties
        remaining: function() {
            return this.filterBy('isCompleted', false).get('length');
        }.property('@each.isCompleted'),
        inflection: function() {
            return (this.get('remaining') === 1) ? 'item' : 'items';
        }.property('remaining'),
        completed: function() {
            return this.filterBy('isCompleted', true).get('length');
        }.property('@each.isCompleted'),
        hasCompleted: function() {
            return this.get('completed') > 0;
        }.property('completed'),
        allAreDone: function(key, value) {
            if (value === undefined) {
                return !!this.get('length') && this.everyProperty('isCompleted', true);
            }
            else {
                this.setEach('isCompleted', value);
                this.invoke('save');
            }
        }.property('@each.isCompleted'),

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
            },
            clearCompleted: function() {
                var completed = this.filterBy('isCompleted', true);
                completed.invoke('deleteRecord');
                completed.invoke('save');
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
            },
            acceptChanges: function() {
                this.set('isEditing', false);

                if (Ember.isEmpty(this.get('model.title'))) {
                    this.send('removeTodo');
                }
                else {
                    this.get('model').save();
                }
            },
            removeTodo: function() {
                var todo = this.get('model');
                todo.deleteRecord();
                todo.save();
            }
        }
    });

});
