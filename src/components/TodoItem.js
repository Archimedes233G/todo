import React, { useState } from 'react';

const TodoItem = ({ todo, toggleComplete, deleteTodo, updateTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(todo.task);
  const [editedDueDate, setEditedDueDate] = useState(todo.due_date);
  const [editedPriority, setEditedPriority] = useState(todo.priority);

  const handleSave = () => {
    updateTodo(todo.id, editedTask, editedDueDate, editedPriority);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask(todo.task);
    setEditedDueDate(todo.due_date);
    setEditedPriority(todo.priority);
    setIsEditing(false);
  };

  const handleSingleClick = () => {
    toggleComplete(todo.id);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const priorityClass = todo.priority === 'high' ? 'high-priority' : todo.priority === 'medium' ? 'medium-priority' : 'low-priority';

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''} ${priorityClass}`}>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedTask}
            onChange={(e) => setEditedTask(e.target.value)}
          />
          <input
            type="date"
            value={editedDueDate}
            onChange={(e) => setEditedDueDate(e.target.value)}
          />
          <select
            value={editedPriority}
            onChange={(e) => setEditedPriority(e.target.value)}
          >
            <option value="low">Low Importance</option>
            <option value="medium">Medium Importance</option>
            <option value="high">High Importance</option>
          </select>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <>
          <div
            className="todo-content"
            onClick={handleSingleClick}
            onDoubleClick={handleDoubleClick}
          >
            <span>{todo.task}</span>
            {todo.due_date && <small>Due: {new Date(todo.due_date).toLocaleDateString()}</small>}
          </div>
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </>
      )}
    </li>
  );
};

export default TodoItem;
