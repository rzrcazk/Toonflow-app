import express from "express";
import u from "@/utils";
import { success } from "@/lib/responseFormat";
import { formatProjectList } from "@/utils/formatProject";
const router = express.Router();

// 获取项目列表
export default router.post("/", async (req, res) => {
  const data = await u.db("o_project").select("*");
  res.status(200).send(success(formatProjectList(data)));
});
