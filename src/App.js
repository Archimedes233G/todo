import React, { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Auth from './components/Auth';
import supabase from './supabase';
import './index.css';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [session, setSession] = useState(null);
  const [userId, setUserId] = useState(null);

  const fetchTodos = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching todos:', error);
    } else {
      setTodos(data || []); // Ensure data is not null or undefined
    }
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        return;
      }
      setSession(session);
      if (session) {
        setUserId(session.user.id);
        fetchTodos();
      }
    };

    getSession();

    const todosSubscription = supabase
      .channel('todos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'todos' }, payload => {
        fetchTodos();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(todosSubscription);
    };
  }, [userId]);

  const addTodo = async ({ task, due_date, priority }) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('todos')
      .insert([{ task, completed: false, due_date, priority, user_id: userId }]);

    if (error) {
      console.error('Error adding todo:', error);
    } else {
      setTodos((prevTodos) => [...prevTodos, ...(data || [])]); // Ensure data is not null or undefined
    }
  };

  const updateTodo = async (id, task, due_date, priority) => {
    if (!userId) return;

    const { error } = await supabase
      .from('todos')
      .update({ task, due_date, priority })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating todo:', error);
    } else {
      fetchTodos();
    }
  };

  const toggleComplete = async (id) => {
    if (!userId) return;

    const todo = todos.find((t) => t.id === id);
    const { error } = await supabase
      .from('todos')
      .update({ completed: !todo.completed })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    if (!userId) return;

    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting todo:', error);
    } else {
      setTodos((prevTodos) => prevTodos.filter((t) => t.id !== id));
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error.message);
    setSession(null);
    setUserId(null);
  };

  return (
    <div className="App">
      <header>
        <h1>Todo</h1>
        {session ? (
          <>
            <TodoForm addTodo={addTodo} />
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Auth onAuth={fetchTodos} />
        )}
      </header>
      <main>
        {session && <TodoList todos={todos} toggleComplete={toggleComplete} deleteTodo={deleteTodo} updateTodo={updateTodo} />}
      </main>
    </div>
  );
};

export default App;
