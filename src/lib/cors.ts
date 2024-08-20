import Cors from "cors";

// Initialize the cors middleware
const cors = Cors({
  methods: ["GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"],
  origin: ["http://localhost:3000"], // Add your allowed origin here
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

// Helper method to wait for middleware to execute before continuing
// See: https://nextjs.org/docs/api-routes/api-middlewares
function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default cors;
export { runMiddleware };
