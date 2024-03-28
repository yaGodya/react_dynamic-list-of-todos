/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { getTodos } from './api';

import { Todo } from './types/Todo';
import { FilteredOptions } from './components/TodoFilter';
// import { User } from './types/User';

function letFiltred(
  todos: Todo[],
  options: FilteredOptions,
  query: string,
): Todo[] {
  let visibleTodos = [...todos];

  visibleTodos = visibleTodos.filter(todo => {
    switch (options) {
      case FilteredOptions.Active:
        return !todo.completed;
      case FilteredOptions.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  visibleTodos = visibleTodos.filter(todo => {
    return todo.title.toLowerCase().includes(query.toLowerCase());
  });

  return visibleTodos;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectTodo, setSelectTodo] = useState<Todo | null>(null);
  const [query, setQuery] = useState('');
  const [filteredField, setFilterField] = useState<FilteredOptions>(
    FilteredOptions.All,
  );

  useEffect(() => {
    setLoading(true);

    getTodos()
      .then(newTodos => {
        setTodos(newTodos);
      })
      .catch(() => {
        setError('something wrong');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const visibleTodos = letFiltred(todos, filteredField, query);

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                query={query}
                filteredField={filteredField}
                setQuery={setQuery}
                setFilterField={setFilterField}
              />
            </div>

            <div className="block">
              {error && !loading && <span>{error}</span>}

              {loading && <Loader />}

              {!loading && todos.length > 0 && (
                <TodoList
                  todos={visibleTodos}
                  setSelectTodo={setSelectTodo}
                  selectTodo={selectTodo}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {selectTodo && (
        <TodoModal selectTodo={selectTodo} setSelectTodo={setSelectTodo} />
      )}
    </>
  );
};
