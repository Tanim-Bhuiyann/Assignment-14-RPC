"use client"
import TodoApp from "@/components/todo-app";
import { AppType } from "@/hono/src/index";
import { hc } from "@/hono/src/index";


import { useEffect, useState } from "react";



export default function Home() {

  const [data, setData] = useState (null);
  const [loading, setLoading] = useState(true);
 // const client = hc<AppType>("http://localhost:3000/");


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3000/todos"); // specify your API endpoint
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log("data",data);
  if (loading) return <p>Loading...</p>;

  if (!data || data.length === 0) return <p>No todos available.</p>;

 /*  const response = await client.todos.$get();
  const data = await response.json();
  console.log(data);
 */
  return (
    <>
    <TodoApp/>
     {/*  <div>
      <h1>Todo List</h1>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {data.map((todo) => (
          <li key={todo.id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
            <h2>{todo.title}</h2>
            <p>Status: <strong>{todo.status}</strong></p>
            <p>Created At: {new Date(todo.createdAt).toLocaleString()}</p>
            <p>Updated At: {new Date(todo.updatedAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div> */}
    </>
  );
}
