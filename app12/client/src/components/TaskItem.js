import React from 'react';

function TaskItem({ task, toggleTaskStatus, deleteTask }) {
  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        className="task-checkbox"
        checked={task.completed}
        onChange={() => toggleTaskStatus(task.id)}
      />
      <span className="task-text">{task.title}</span>
      <button 
        className="task-delete" 
        onClick={() => deleteTask(task.id)}
        title="Excluir tarefa"
      >
        ✖
      </button>
    </li>
  );
}

export default TaskItem; 