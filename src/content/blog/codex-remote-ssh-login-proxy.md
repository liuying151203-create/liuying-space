---
title: 在 VS Code Remote SSH 中使用 Codex：登录与代理配置
description: 整理一次在远程服务器上使用 VS Code Codex 插件时，如何处理登录状态、SSH 端口转发和远程代理配置的问题。
pubDate: 2026-06-09
tags:
  - codex
  - vscode
  - remote-ssh
  - proxy
category: Tutorial
draft: false
featured: false
---

这篇记录的是一个很具体的场景：本地 VS Code 已经可以正常登录 Codex，但通过 Remote SSH 连接远程服务器后，Codex 插件在远程环境里无法登录或无法联网。

我主要参考了两份资料：

- [知乎上的配置记录](https://zhuanlan.zhihu.com/p/2022021153003184392)
- [lxr-1204/vscode_codeX](https://github.com/lxr-1204/vscode_codeX/tree/main)

这篇不是重新发明一套方法，而是把配置过程按“为什么这么做”和“每一步检查什么”重新整理一遍。

## 适用场景

这套方法适合下面这种情况：

- 本地电脑可以正常访问 OpenAI / Codex。
- 本地 VS Code 里 Codex 插件已经登录成功。
- 使用 VS Code Remote SSH 连接远程 Linux 服务器。
- 远程服务器不能直接访问 OpenAI 相关服务。
- 希望 Codex 插件在远程工作区里也能正常登录和调用。

关键点是：Remote SSH 打开远程项目后，扩展通常运行在远程服务器侧。也就是说，Codex 插件发起请求时，网络出口不一定是本地电脑，而是远程服务器。

所以，本地浏览器能访问，不代表远程 Codex 插件也能访问。

## 整体思路

整个配置可以拆成两件事：

1. 让远程服务器能通过本地代理访问外网。
2. 让远程环境拿到 Codex 的登录状态。

代理部分的链路大概是：

```text
远程 VS Code Codex 插件
  -> 远程服务器 127.0.0.1:yyyy
  -> SSH RemoteForward
  -> 本地电脑 127.0.0.1:xxxx
  -> 本地代理工具
  -> OpenAI / Codex 服务
```

这里有两个端口：

- `xxxx`：本地代理工具实际监听的端口，例如 `7890`。
- `yyyy`：远程服务器上暴露出来的转发端口，例如 `7890` 或 `7891`。

这两个端口可以一样，也可以不一样。为了方便理解，下面用：

```text
本地代理端口 xxxx = 7890
远程转发端口 yyyy = 7891
```

## 第一步：确认本地代理端口

先在本地代理工具里确认真正用于 HTTP / HTTPS 代理的端口。

以 Clash 类工具为例，常见端口可能是：

```text
HTTP / Mixed Port: 7890
```

需要注意：有些工具还有控制面板端口，比如 `9090`。这个端口通常不是给 `http_proxy` / `https_proxy` 用的，不要填错。

本地代理地址可以理解成：

```text
http://127.0.0.1:7890
```

<img src="../../images/blog/codex-remote-ssh-login-proxy/local-proxy-port.svg" alt="本地代理工具端口设置截图占位" />

## 第二步：配置 SSH 远程端口转发

在本地电脑编辑 SSH 配置文件：

```bash
~/.ssh/config
```

给你的服务器 Host 加上 `RemoteForward`：

```text
Host my-server
    HostName 你的服务器IP或域名
    User 你的用户名
    RemoteForward 7891 127.0.0.1:7890
```

这行的意思是：

```text
远程服务器的 127.0.0.1:7891
转发到
本地电脑的 127.0.0.1:7890
```

配置完之后，需要重新连接 Remote SSH。只改配置但不重连，远程转发通常不会生效。

可以在本地用：

```bash
ssh my-server
```

或者直接在 VS Code 里重新连接这个 Remote SSH 主机。

<img src="../../images/blog/codex-remote-ssh-login-proxy/remote-ssh-config.svg" alt="VS Code Remote SSH 连接配置截图占位" />

## 第三步：在远程服务器设置代理环境变量

连接到远程服务器后，在远程终端中设置：

```bash
export http_proxy=http://127.0.0.1:7891
export https_proxy=http://127.0.0.1:7891
export HTTP_PROXY=http://127.0.0.1:7891
export HTTPS_PROXY=http://127.0.0.1:7891
```

这里的 `127.0.0.1:7891` 是远程服务器看到的代理地址，不是本地电脑的地址。

可以检查一下：

```bash
echo $http_proxy
echo $https_proxy
```

如果想让它每次登录都生效，可以写到远程服务器的 shell 配置里，例如：

```bash
~/.bashrc
```

写完后执行：

```bash
source ~/.bashrc
```

如果你用的是 zsh，就写到：

```bash
~/.zshrc
```

## 第四步：配置 VS Code 的 Remote Settings

只配置远程终端的环境变量还不一定够，因为 VS Code 扩展也可能读取 VS Code 自己的代理设置。

这里要注意：应该改 Remote Settings，不是本地 Settings。

在 VS Code 里：

1. 按 `Ctrl + Shift + P`。
2. 搜索 `Open Remote Settings`。
3. 搜索 `proxy`。
4. 找到 `Http: Proxy`。
5. 设置为：

```text
http://127.0.0.1:7891
```

如果直接编辑远程 settings JSON，可以写成：

```json
{
  "http.proxy": "http://127.0.0.1:7891"
}
```

设置后建议执行：

```text
Developer: Reload Window
```

或者重新连接 Remote SSH。

<img src="../../images/blog/codex-remote-ssh-login-proxy/remote-settings-proxy.svg" alt="VS Code Remote Settings 代理配置截图占位" />

## 第五步：处理 Codex 登录状态

参考资料里采用的方式是：先在本地 VS Code 中完成 Codex 登录，然后把本地生成的 `~/.codex` 同步到远程服务器。

本地打包：

```bash
tar -cf codex.tar -C ~ .codex
```

上传到远程服务器：

```bash
scp codex.tar my-server:~/
```

在远程服务器解压：

```bash
tar -xf ~/codex.tar -C ~/
```

然后确认远程服务器上存在：

```bash
ls ~/.codex
```

这个目录和登录状态有关，只应该放在自己可信的远程服务器和自己的用户目录下。不要把里面的内容贴到公开文章、聊天记录或截图里。

<img src="../../images/blog/codex-remote-ssh-login-proxy/codex-config-directory.svg" alt="Codex 登录状态目录截图占位" />

## 第六步：重新打开远程工作区

完成上面的配置后，建议完整重连一次：

1. 关闭当前 Remote SSH 窗口。
2. 重新连接远程服务器。
3. 打开远程项目。
4. 等 VS Code 远程扩展加载完成。
5. 再尝试打开 Codex 插件。

如果配置正确，Codex 插件应该能在远程工作区里复用登录状态，并通过本地代理访问服务。

## 常见错误

### 把本地代理端口和远程端口搞混

本地 `127.0.0.1:7890` 和远程 `127.0.0.1:7890` 不是同一个东西。

如果没有 `RemoteForward`，远程服务器访问自己的 `127.0.0.1:7890`，不会自动连到本地电脑。

### 填了代理工具的控制端口

有些代理工具会有控制端口，比如 `9090`。这个端口通常不是 HTTP 代理端口。

要填的是 HTTP / HTTPS / Mixed Port。

### 改了本地 Settings，没有改 Remote Settings

Remote SSH 场景下，Codex 插件运行在远程侧时，要重点检查 Remote Settings。

本地 Settings 改对了，不代表远程扩展能读到。

### 配置 SSH 后没有重连

`RemoteForward` 是连接建立时生效的。改完 `~/.ssh/config` 后，需要重新建立 SSH 连接。

### 只设置了小写或只设置了大写代理变量

不同程序读取代理变量的习惯不完全一样。为了减少问题，可以同时设置：

```bash
http_proxy
https_proxy
HTTP_PROXY
HTTPS_PROXY
```

## 检查清单

最后可以按这个清单过一遍：

- 本地 Codex 插件已经登录成功。
- 本地代理端口确认无误，例如 `7890`。
- 本地 `~/.ssh/config` 配置了 `RemoteForward 7891 127.0.0.1:7890`。
- VS Code Remote SSH 已经重连。
- 远程终端中设置了 `http_proxy` / `https_proxy`。
- Remote Settings 中设置了 `http.proxy`。
- 远程服务器上存在 `~/.codex`。
- 重新打开远程工作区后，Codex 插件可以正常使用。

## 小结

这个问题的核心不是 Codex 插件本身复杂，而是 Remote SSH 场景下有三层环境：

- 本地电脑
- SSH 连接
- 远程服务器

代理、登录状态、VS Code 设置分别可能落在不同层。如果没有先分清“当前插件到底运行在哪里”，就很容易出现本地一切正常、远程一直失败的情况。

我的理解是：先把本地代理通过 SSH 转发到远程，再让远程终端和远程 VS Code 设置都指向这个转发端口，最后同步 Codex 登录状态。这样整条链路才是闭合的。

## 参考资料

- [知乎：远程服务器配置 Codex 的相关记录](https://zhuanlan.zhihu.com/p/2022021153003184392)
- [lxr-1204/vscode_codeX](https://github.com/lxr-1204/vscode_codeX/tree/main)
