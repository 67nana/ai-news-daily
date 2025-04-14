import { pushToDingTalk } from "../scripts/dingtalk"

export default async function handler(_req, res) {
  await pushToDingTalk()
  res.status(200).send("✅ DingTalk 推送成功！哟喵～")
}
