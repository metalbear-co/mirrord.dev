---
title: "Limitations"
description: "What are the limitations to using mirrord?"
date: 2020-11-16T13:59:39+01:00
lastmod: 2020-11-16T13:59:39+01:00
draft: false
images: []
menu:
  docs:
    parent: "faq"
weight: 120
toc: true
tags: ["open source", "team", "enterprise"]
---

### What frameworks/languages does mirrord support?

mirrord works by [hooking libc](https://metalbear.co/blog/mirrord-internals-hooking-libc-functions-in-rust-and-fixing-bugs/), so it should work with any language/framework that uses libc (vast majority).

This includes: Rust, Node, Python, Java, Kotlin, Ruby, and others (most languages use libc).

mirrord also supports for [Go](https://metalbear.co/blog/hooking-go-from-rust-hitchhikers-guide-to-the-go-laxy/), which doesn't use libc

### Does mirrord support clusters with a service mesh like Istio or Linkerd?

Yes. (there is a [known issue](https://github.com/metalbear-co/mirrord/issues/2456) with istio proxy in "ambient" mode)

### Does mirrord support OpenShift?

Yes, mirrord works with OpenShift. However, OpenShift usually ships with a default security policy that doesn't let mirrord create pods.
To fix this, you would need to tweak your `scc` settings - more information [here](https://docs.openshift.com/container-platform/3.11/admin_guide/manage_scc.html).
If you'd rather keep the default security policies, we recommend trying out [mirrord for Teams]({{< ref "/docs/overview/teams" >}} "mirrord for Teams"). See [this question](#what-if-i-cant-create-containers-with-the-capabilities-mirrord-requires-in-my-cluster) for more info.