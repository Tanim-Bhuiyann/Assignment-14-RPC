









/* import { v4 as uuidv4 } from "uuid";
import { usersTable } from "./schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { Hono, type Context } from 'hono';
import { cors } from 'hono/cors';


const app = new Hono()
.use('*', cors({ origin: '*' }))

  .post("/todos", async (c: Context) => {
    try {
      const { title } = await c.req.json();
      if (!title) {
        throw new Error("Title required");
      }
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
      return c.json({ error: (error as Error).message }, 400);
    }
  })
  .get("/todos", async (c) => {
    try {
      const todos = await db.select().from(usersTable).all();
      return c.json(todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      return c.json({ error: "Failed to fetch todos" }, 500);
    }
  })
  .put("/todos/:id", async (c) => {
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
  .delete("/todos/:id", async (c) => {
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
  .get("/todos/:id", async (c) => {
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

  export type AppType = typeof app;
  export default app;


 */