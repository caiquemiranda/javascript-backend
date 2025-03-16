import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar tarefas da API quando o componente for montado
  useEffect(() => {
    fetchTasks();
  }, []);

  // Função para buscar todas as tarefas da API
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar tarefas. Por favor, tente novamente.');
      console.error('Erro ao buscar tarefas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Adicionar uma nova tarefa
  const addTask = async (title) => {
    try {
      const response = await axios.post('/api/tasks', { title });
      setTasks([...tasks, response.data]);
    } catch (err) {
      setError('Erro ao adicionar tarefa.');
      console.error('Erro ao adicionar tarefa:', err);
    }
  };

  // Marcar tarefa como completa/incompleta
  const toggleTaskStatus = async (id) => {
    try {
      const task = tasks.find(task => task.id === id);
      const response = await axios.put(`/api/tasks/${id}`, {
        completed: !task.completed
      });
      
      setTasks(tasks.map(task => 
        task.id === id ? response.data : task
      ));
    } catch (err) {
      setError('Erro ao atualizar tarefa.');
      console.error('Erro ao atualizar tarefa:', err);
    }
  };

  // Excluir uma tarefa
  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Erro ao excluir tarefa.');
      console.error('Erro ao excluir tarefa:', err);
    }
  };

  return (
    <div className="container">
      <h1>Sistema de Tarefas</h1>
      
      <TaskForm addTask={addTask} />
      
      {error && <p className="error-message">{error}</p>}
      
      {isLoading ? (
        <p>Carregando tarefas...</p>
      ) : (
        <TaskList 
          tasks={tasks} 
          toggleTaskStatus={toggleTaskStatus} 
          deleteTask={deleteTask} 
        />
      )}
    </div>
  );
}

export default App; 