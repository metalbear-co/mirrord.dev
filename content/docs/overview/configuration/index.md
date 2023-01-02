---
title: "Configuration"
description: "mirrord's configuration"
date: 2020-11-16T13:59:39+01:00
lastmod: 2020-11-16T13:59:39+01:00
draft: false
images: []
menu:
  docs:
    parent: "overview"
weight: 120
toc: true
layout: configuration
---

- Run mirrord with read-only file operations, mirroring traffic, skipping unwanted processes:
  
  ```toml
  # mirrord-config.toml

  target = "pod/sample-pod-1234" skip_processes = ["ide-debugger", "ide-service"] # we don't want mirrord to hook into these

  [agent] log_level = "debug" ttl = 1024 # seconds

  [feature] fs = "read" # default

  [feature.network] incoming = "mirror" # default 
  ```
- Run mirrord with read-write file operations, stealing traffic, accept local TLS certificates, use a custom mirrord-agent image:
  
  ```toml
  # mirrord-config.toml

  target = "pod/sample-pod-1234" acceptinvalidcertificates = true

  [agent] loglevel = "debug" ttl = 1024 # seconds image = "registry/mirrord-agent-custom:latest" imagepull_policy = "Always"

  [feature] fs = "write"

  [feature.network] incoming = "steal"
  ```