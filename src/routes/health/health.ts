import express from "express";
const router = express.Router();

export default router.get("/", (_req, res) => {
  res.status(200).json({ status: "ok" });
});
