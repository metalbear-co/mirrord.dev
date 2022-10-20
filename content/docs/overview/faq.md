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
weight: 121
toc: true
---

## Can I intercept traffic instead of duplicating it?

Yes, you can use the `--steal` flag to intercept traffic instead of duplicating it.

## What frameworks/languages does mirrord support?

mirrord works by [hooking libc](https://metalbear.co/blog/mirrord-internals-hooking-libc-functions-in-rust-and-fixing-bugs/), so it should work with any language/framework that uses libc (vast majority).

This includes: Rust, Node, Python, Java, Kotlin, Ruby, and others (most languages use libc).

mirrord also has specific support for the following languages that don't use libc: [Go](https://metalbear.co/blog/hooking-go-from-rust-hitchhikers-guide-to-the-go-laxy/)

## Does mirrord install anything on the cluster?

No, mirrord doesn't install anything on the cluster, nor does it have any persistent state. It does spawn a short-living pod/container to run the proxy, which is automatically removed when mirrord exits.

## How is mirrord different from Telepresence?

The main differences are:
* mirrord works on the process level, meaning it doesn't require you to run a "daemon" locally and it doesn't change your local machine settings. For example, if you run another process, it *won't* be affected by mirrord.
* mirrord doesn't require you to install anything on the cluster.
* mirrord duplicates traffic and doesn't intercept/steal it by default.

More details can be found in this [GitHub discussion.](https://github.com/metalbear-co/mirrord/discussions/154#discussioncomment-2972127)

## Does mirrord support clusters with a service mesh like Istio or Linkerd?

Yes. However, traffic mirroring isn't currently supported - you can use the --steal argument to steal traffic instead.

## I've run my program with mirrord but it seems to have no effect, what could be the issue?

There are currently two known cases where mirrord cannot load into the application's process:
1. [SIP](https://en.wikipedia.org/wiki/System_Integrity_Protection) on Mac. Check the logs for a warning about SIP.
   mirrord currently can't load into SIP binaries (we're working on a fix). In the meanwhile you could try
   copying the binary you're trying to run into an unprotected directory (e.g. anywhere in your home directory) and
   if it still doesn't work, also remove the signature with `sudo codesign --remove-signature ./<your-binary>`.
2. Statically linked binaries. Since mirrord uses the dynamic linker to load into the application's process, 
   hook some key functions, it cannot load if the binary is statically linked. Support for statically linked
   binaries is planned for the long term, but for now you would have to make sure your binaries are dynamically
   linked in order to use mirrord on them. With Go programs, for example, it is as simple as adding `import "C"` to
   your program code.
