import { writeFileSync } from "node:fs"
import { join } from "node:path"
import { pinyin } from "@napi-rs/pinyin"
import { consola } from "consola"
import { projectDir } from "../shared/dir"
import { genSources } from "../shared/pre-sources"

// 生成数据源
const sources = genSources()

// 生成 pinyin.json
try {
  const pinyinMap = Object.fromEntries(
    Object.entries(sources)
      .filter(([, v]) => !v.redirect)
      .map(([k, v]) => {
        return [k, pinyin(v.title ? `${v.name}-${v.title}` : v.name).join("")]
      }),
  )

  const pinyinPath = join(projectDir, "./shared/pinyin.json")
  writeFileSync(pinyinPath, JSON.stringify(pinyinMap, null, 2))
  consola.success(`✅ Generated pinyin.json at ${pinyinPath}`)
} catch (error) {
  consola.error("❌ Failed to generate pinyin.json", error)
}

// 生成 sources.json
try {
  const sourcesPath = join(projectDir, "./shared/sources.json")
  writeFileSync(sourcesPath, JSON.stringify(sources, null, 2))
  consola.success(`✅ Generated sources.json at ${sourcesPath}`)
} catch (error) {
  consola.error("❌ Failed to generate sources.json", error)
}

// 新增：生成 summary.json ✅
try {
  const summary = Object.entries(sources).map(([_, value]) => {
    return {
      title: value.title || value.name,
      link: value.home || "https://example.com", // ✅ 重点修正！
    }
  })

  const summaryPath = join(projectDir, "./summary.json")
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2))
  consola.success(`✅ Generated summary.json at ${summaryPath}`)
} catch (error) {
  consola.error("❌ Failed to generate summary.json", error)
}
