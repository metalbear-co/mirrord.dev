---
title: "New Feature"
description: "How to start writing a new feature for mirrord"
date: 2022-06-15T08:48:45+00:00
lastmod: 2022-06-15T08:48:45+00:00
draft: false
images: []
menu:
  docs:
    parent: "developer"
weight: 110
toc: true
---

This guide is for writing new features to mirrord, specifically features that introduce new hooks.

Adding a feature (file system, network) can be tricky and there are a lot of edge cases we might need to cover. 

In order to have a more structured approach, here’s the flow you should follow when working on such a feature.

1. Start with the use case. Write an example use case of the feature, for example “App needs to read credentials from a file”.
2. Write a minimal app that implements the use case - so in the case of our example, an app that reads credentials from a file. Start with either Node or Python as those are most common.
3. Figure out what functions need to be hooked in order for the behavior to be run through the mirrord-agent instead of locally. We suggest using `strace`.
4. Write a doc on how you would hook and handle the cases, for example:
    1. To implement use case “App needs to read credentials from a file*”
    2. I will hook `open` and `read` handling calls only with flags O_RDONLY.
    3. Once `open` is called, I’ll send a blocking request to the agent to open the remote file, returning the return code of the operation. 
    4. Create an fd using `memfd`. The result will be returned to the local app, and if successful we’ll save that fd into a HashMap that matches between local fd and remote fd/identifier. 
    5. When `read` is called, I will check if the fd being read was previously opened by us, and if it is we’ll send a blocking `read` request to the agent. The result will be sent back to the caller.
    6. ….
5. This doc should go later on to our mirrord docs for advanced developers so people can understand how stuff works
6. After approval of the implementation, you can start writing code, and add relevant e2e tests.