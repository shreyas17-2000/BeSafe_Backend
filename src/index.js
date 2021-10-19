import "./env.js";
import fastify from "fastify";
import { connectToDatabase } from "./db.js";
import { registerUser } from "./register.js";

const app = fastify();

async function startApp() {
  try {
    app.get("/", {}, (request, reply) => {
      reply.send({
        data: "Hello world",
      });
    });
    app.post("/api/register", {}, async (request, reply) => {
      try {
        const userID = await registerUser(
          request.body.name,
          request.body.email,
          request.body.password,
          request.body.confirmpassword
        );
        console.log("userID", userID);
      } catch (error) {
        console.error(error);
      }
    });
    await app.listen(3000);
    console.log("🚀 Server listening at port 3000");
  } catch (e) {
    console.log("e", e);
  }
}

connectToDatabase().then(() => {
  startApp();
});
