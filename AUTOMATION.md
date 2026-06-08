# 自动化方案

这个站点可以变成低维护内容站，但不是完全无成本收益机器。合理做法是让自动化负责采集、整理、生成页面和部署；你只做少量监控。

## 自动化链路

1. `scripts/update-content.mjs` 每天读取 `content/sources.json` 中的公开 RSS 来源。
2. 脚本生成一篇每日简报到 `articles/`。
3. 脚本更新首页文章卡片和 `sitemap.xml`。
4. GitHub Actions 每天自动运行脚本并提交更新。
5. Cloudflare Pages 连接 GitHub 仓库后，每次提交都会自动部署。

## 一次性配置

1. 把当前项目推送到 GitHub。
2. 在 Cloudflare Pages 项目里切换为连接 GitHub 仓库部署，或新建一个 Pages 项目连接该仓库。
3. Build command 填：

```txt
npm run update-content
```

4. Output directory 填：

```txt
/
```

5. 保持自定义域名 `aibriefnote.com` 绑定到该 Pages 项目。

## 内容来源

来源配置在：

```txt
content/sources.json
```

可以添加更多公开 RSS，但不要抓取全文复制。建议只做摘要、引用标题、附来源链接和编辑判断。

## 收益现实

自动化可以降低维护成本，但不能保证收益。AdSense 收益取决于真实访问、国家地区、广告填充、页面主题和用户行为。不要使用自动刷新、机器人访问、诱导点击或低价值页面矩阵。
