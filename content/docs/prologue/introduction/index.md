---
title: "Introduction"
date: 2022-05-26T08:48:57+00:00
lastmod: 2022-05-26T08:48:57+00:00
draft: false
# resources: ["diagram.jpeg"]
images: []
menu:
  docs:
    parent: "prologue"
weight: 100
toc: true
---

mirrord is an open-source tool that lets developers run local processes in the context of their cloud environment. It’s meant to provide the benefits of running your service on a cloud environment (e.g. staging) without actually going through the hassle of deploying it there, and without disrupting the environment by deploying untested code.

## Why?
{{<figure src="loop.png">}}

## How It Works

mirrord runs in two places - in the memory of your local process (the mirrord-layer), and as a pod in your cloud environment (the mirrord-agent).
{{<figure src="diagram.png" background-color="white" alt="mirrord - Basic Architecure" caption="<em>mirrord - Basic Architecture</em>">}}

When you start your local process with mirrord, it creates a pod in your cloud environment, which listens in on the pod you've passed as an argument. The mirrord-layer then hooks syscalls for your process, overriding its network behavior to instead 
