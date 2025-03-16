import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, toggleTaskStatus, deleteTask }) {
  if (tasks.length === 0) {
    return <p>Não há tarefas cadastradas.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          toggleTaskStatus={toggleTaskStatus}
          deleteTask={deleteTask}
        />
      ))}
    </ul>
  );
}

export default TaskList; 