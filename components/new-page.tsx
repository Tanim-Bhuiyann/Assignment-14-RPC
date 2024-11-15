"use client";

import { AppType } from "../hono/src/index";

import { hc } from "hono/client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

interface Todo {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "complete";
  createdAt: string;
  updatedAt: string;
}

const client = hc<AppType>("http://localhost:3000");

export default function NewTodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const response = await client.todos.$get();
      const data = await response.json();
      console.log("todos:", data);
      setTodos(data);
    } catch (error) {
      console.error("Error loading todos:", error);
    }
  };

  const addTodo = async () => {
    if (!newTask.trim()) return;

    try {
      await client.todos.$post({
        json: {
          title: newTask,
        },
      });
      setNewTask("");
      loadTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await client.todos[":id"].$delete({
        param: { id },
      });
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const updateTodo = async (id: string, currentStatus: string) => {
    let newStatus: "todo" | "in-progress" | "complete";
    if (currentStatus === "todo") newStatus = "in-progress";
    else if (currentStatus === "in-progress") newStatus = "complete";
    else return;
    try {
      await client.todos[":id"].$put({
        param: { id },
        json: {
          status: newStatus,
        },
      });
      loadTodos(); // Refresh the todo list after updating
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const renderTodoList = (status: "todo" | "in-progress" | "complete") => {
    const filteredTodos = todos.filter((todo) => todo.status === status);

    return (
      <Card className="w-full min-h-[13rem]">
        <CardHeader
          className={`${
            status === "todo"
              ? "bg-blue-100"
              : status === "in-progress"
              ? "bg-purple-100"
              : "bg-green-100"
          }`}
        >
          <CardTitle>
            {status === "todo"
              ? "To Do"
              : status === "in-progress"
              ? "In Progress"
              : "Completed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-2">
                {status !== "complete" && (
                  <Checkbox
                    onCheckedChange={() => updateTodo(todo.id, todo.status)}
                  />
                )}
                <span className="font-medium">{todo.title}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTodo(todo.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex items-center min-h-screen justify-center p-4">
      <div className="flex flex-col shadow-lg p-5 w-full rounded-md">
        <div className="grid justify-items-center pt-8">
          <h1 className="text-4xl font-bold">Task Manager</h1>
          <p className="text-gray-600 pt-3">
            Stay organized and productive with our intuitive to-do app.
          </p>
          <div className="pt-6 flex flex-col md:flex-row items-center gap-4 w-full max-w-xl">
            <Input
              type="text"
              placeholder="Add a new task in todo"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTodo();
                }
              }}
              className="w-full"
            />
            <Button onClick={addTodo} disabled={!newTask.trim()}>
              Add Task
            </Button>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-start gap-6 mt-10 w-full">
            {renderTodoList("todo")}
            {renderTodoList("in-progress")}
            {renderTodoList("complete")}
          </div>
        </div>
      </div>
    </div>
  );
}
