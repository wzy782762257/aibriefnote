# Cloudflare Pages 部署步骤

## 当前项目结构

本站现在是 React + Vite + Cloudflare Pages Functions + D1。

Cloudflare Pages 构建设置必须是：

```txt
Build command: npm run build
Build output directory: dist
```

项目里也已经提供 `wrangler.jsonc`：

```json
{
  "pages_build_output_dir": "dist"
}
```

不要把源码根目录当作静态目录直接上传，否则浏览器会看到未编译的 `/src/main.tsx`。

## 方式一：Git 连接部署

1. 登录 Cloudflare。
2. 进入 `Workers & Pages`。
3. 选择当前 Pages 项目。
4. Settings → Builds & deployments。
5. 确认 Build command 是 `npm run build`。
6. 确认 Build output directory 是 `dist`。
7. 推送到 GitHub 后等待 Cloudflare 自动构建。

## 方式二：Direct Upload

1. 登录 Cloudflare。
2. 进入 `Workers & Pages`。
3. 点击 `Create application`。
4. 选择 `Pages`。
5. 选择 `Upload assets` 或 `Direct Upload`。
6. Project name 填一个英文小写名字，例如 `searchsignal`。
7. 本地运行 `npm run build`。
8. 上传 `dist` 文件夹里的全部文件。
9. 部署完成后会得到一个地址，例如：

```txt
https://aibriefnote.com
```

## 回到 AdSense

1. 在 AdSense 首页点击 `将您的网站关联到 AdSense`。
2. 填 Cloudflare Pages 给你的网址，或你绑定后的正式域名。
3. 提交审核。
4. 确认下面三个地址都能打开：

```txt
https://aibriefnote.com/ads.txt
https://aibriefnote.com/privacy
https://aibriefnote.com/sitemap.xml
```

## 广告状态

当前页面已经预填了你的发布商 ID：

```txt
ca-pub-6929744420910509
```

现在只接入了站点级脚本，适合先提交审核。AdSense 审核通过后，可以在后台开启 Auto ads，让 Google 自动投放；也可以创建手动广告单元，再把 `data-ad-slot` 加到页面广告位。
