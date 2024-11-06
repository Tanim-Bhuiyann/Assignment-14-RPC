"use client";

import React, { useState, useEffect } from 'react';

interface Todo {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('http://localhost:3000/todos', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTodos(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Failed to fetch todos';
          
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-pulse text-lg">Loading todos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center p-8">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {todos && todos.length > 0 ? (
        todos.map((todo) => (
          <div 
            key={todo.id} 
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{todo.title}</h2>
            <div className="text-sm text-gray-500">
              <p className="mb-1">Status: <span className="font-medium">{todo.status}</span></p>
              <p>Created: {new Date(todo.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center text-gray-500 mt-8">
          No todos found
        </div>
      )}
    </div>
  );
