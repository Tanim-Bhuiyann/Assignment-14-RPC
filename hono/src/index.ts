import { Hono, type Context } from 'hono';
import { cors } from "hono/cors";
import { v4 as uuidv4 } from "uuid";
import { usersTable } from "./schema";
import { db } from "./db";
import { z } from "zod";
import { eq } from "drizzle-orm";

const todoSchema = z.object({
    title: z.string()
      .min(3, "Title must be at least 3 characters long")
      .max(12, "Title must not exceed 12 characters"),
  });



const app = new Hono()
.use('*', cors({
    origin: '*',
    allowMethods: ['GET' , 'POST' , 'PUT' , 'DELETE'],
    allowHeaders: ['Content-Type'],
    
}))


.post("/todos", async (c: Context) => {
    try {
     
      const { title } = todoSchema.parse(await c.req.json());
  
      const newTodo = {
        id: uuidv4(),
        title,
        status: "todo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
  
      const todos = await db.insert(usersTable).values(newTodo).returning();
      return c.json(todos);
    } catch (error) {
      if (error instanceof z.ZodError) {
        
        return c.json({ error: error.errors.map(e => e.message) }, 400);
      }
      return c.json({ error: (error as Error).message }, 400);
    }
  })


  .get("/todos", async (c: Context) => {
    try {
      const todos = await db.select().from(usersTable).all();
      return c.json(todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      return c.json({ error: "Failed to fetch todos" }, 500);
    }
  })


  .put("/todos/:id", async (c: Context) => {
    try {
      const id = c.req.param("id");
      const { title, status } = await c.req.json();

      const existingTodo = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id))
        .get();

      if (!existingTodo) {
        return c.json({ message: "Todo not found" }, 404);
      }
      const updateFields = {
        updateAt: new Date().toISOString(),
        ...(title && { title }),
        ...(status && { status }),
      };

      const updateTodo = await db
        .update(usersTable)
        .set(updateFields)
        .where(eq(usersTable.id, id))
        .returning();
      return c.json(updateTodo);
    } catch (error) {
      return c.json({ error: (error as Error).message }, 400);
    }
  })

  .delete("/todos/:id", async (c: Context) => {
    try {
      const id = c.req.param("id");

      const existingTodo = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id))
        .get();

      if (!existingTodo) {
        return c.json({ message: "Todo not found" }, 404);
      }

      await db.delete(usersTable).where(eq(usersTable.id, id));

      return c.json({ message: "Todo deleted successfully" });
    } catch (error) {
      console.error("Error fetching todo:", error);
      return c.json({ error: (error as Error).message }, 400);
    }
  })

  .get("/todos/:id", async (c: Context) => {
    try {
      const id = c.req.param("id");
      const todo = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id))
        .get();

      if (!todo) {
        return c.json({ message: "Todo not found" }, 404);
      }

      return c.json(todo);
    } catch (error) {
      console.error("Error fetching todo:", error);
      return c.json({ error: (error as Error).message }, 400);
    }
  });

export default app;
export type AppType = typeof app;