---
title: "FAQ"
description: "Frequently Asked Questions"
date: 2020-11-16T13:59:39+01:00
lastmod: 2020-11-16T13:59:39+01:00
draft: false
images: []
menu:
  docs:
    parent: "overview"
weight: 200
toc: true
---

## Can I intercept traffic?

Yes, you can use the `--steal` flag to intercept traffic instead of duplicating it.

## What frameworks/languages does mirrord support?

mirrord works by [hooking libc](https://metalbear.co/blog/mirrord-internals-hooking-libc-functions-in-rust-and-fixing-bugs/), so it should work with any language/framework that uses libc. For languages such as Go that might skip libc usage in some cases, [we have a custom support in place](https://metalbear.co/blog/hooking-go-from-rust-hitchhikers-guide-to-the-go-laxy/) (by default, should work out of the box).

## Does mirrord install anything on the cluster?

No, mirrord doesn't install anything on the cluster, nor does it have any persistent state. It does spawn a short-living pod/container to run the proxy but it should be cleaned up after mirrord exits.

## How is mirrord different from Telepresence?

The main differences are:
* mirrord works on the process level, meaning it doesn't require you to run a "daemon" locally and it doesn't change your local machine settings. For example, if you run another process, it *won't* be affected by mirrord.
* mirrord doesn't require you to install anything on the cluster.
* mirrord duplicates traffic and doesn't intercept/steal it by default.
* As mirrord evolve, we plan to add more "protective" features that reduce side effects on the remote environment (e.g. intercepting specific streams, connecting to only specific resources, CoW filesystem).

More details can be found in this [GitHub discussion.](https://github.com/metalbear-co/mirrord/discussions/154#discussioncomment-2972127)