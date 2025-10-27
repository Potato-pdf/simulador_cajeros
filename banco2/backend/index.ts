import { initDatabase } from "./src/db/init";
import { AtmController } from "./src/controllers/atmController";

await initDatabase();

const server = Bun.serve({
  port: 3001,
  async fetch(req) {
    // CORS
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const url = new URL(req.url);

    if (url.pathname === "/api/verify" && req.method === "GET") {
      const params = url.searchParams;
      const cardNumber = params.get("cardNumber");
      if (!cardNumber) {
        return new Response(JSON.stringify({ error: "cardNumber required" }), { status: 400 });
      }
      const mockReq = { query: { cardNumber } };
      let mockRes: any = {};
      await AtmController.verifyCard(mockReq, {
        json: (data: any) => { mockRes.data = data; }
      });
      return new Response(JSON.stringify(mockRes.data), { 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        } 
      });
    }

    if (url.pathname === "/api/withdraw" && req.method === "POST") {
      const body = await req.json();
      const mockReq = { body };
      let mockRes: any = {};
      await AtmController.withdraw(mockReq, {
        json: (data: any) => { mockRes.data = data; }
      });
      return new Response(JSON.stringify(mockRes.data), { 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        } 
      });
    }

    if (url.pathname === "/api/create-account" && req.method === "POST") {
      const body = await req.json();
      const mockReq = { body };
      let mockRes: any = {
        status: (code: number) => ({
          json: (data: any) => { mockRes.code = code; mockRes.data = data; }
        }),
        json: (data: any) => { mockRes.data = data; }
      };
      await AtmController.createAccount(mockReq, mockRes);
      return new Response(JSON.stringify(mockRes.data), { 
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: mockRes.code || 200
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running on port ${server.port}`);