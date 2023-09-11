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
shallowToc: true
---

## General

### What does mirrord actually do?

First and most important, mirrord *doesn't just mirror traffic*. It does that, but also a lot more.

mirrord lets you connect a local process to your Kubernetes cluster. It does this by hooking all of the input and output points of the process - network traffic, file access, and environment variables - and proxying them to the cluster.
This means that although your code is running locally, it "thinks" it's running in the cloud, which lets you test it in cloud conditions:
1. Without having to run your entire deployment locally
2. Without going through CI and deployment
3. Without deploying untested code to the cloud environment - the stable version of the code is still running in the cluster and handling requests

### Is mirrord free?

mirrord is free and open source (MIT License).
Our paid offering, mirrord for Teams, includes a Kubernetes operator that acts as a control plane for mirrord.
You can read more about it [here]({{< ref "/docs/teams/introduction" >}} "mirrord for Teams").

### Can I intercept traffic instead of duplicating it?

Yes, you can use the `--steal` flag to intercept traffic instead of duplicating it.

### Does mirrord install anything on the cluster?

No, mirrord doesn't install anything on the cluster, nor does it have any persistent state. It does spawn a short-living pod/container to run the proxy, which is automatically removed when mirrord exits. mirrord works using the Kubernetes API, and so the only prerequisite to start using mirrord is to have kubectl configured for your cluster.

If you have any restrictions for pulling external images inside your cluster, you have to allow pulling of ghcr.io/metalbear-co/mirrord image.

### How does mirrord protect against disrupting my shared environment with my local code?

* By letting you mirror traffic rather than intercept it, the stable version of the code can still run in the cluster and handle requests.
* By letting you control which functionality runs locally and which runs in the cloud, you can configure mirrord in the way that's safest for your architecture. For example, you can configure mirrord to read files and receive incoming traffic from the cloud, but write files and send outgoing traffic locally.
Our main goal in future versions of mirrord is to reduce the risk of disruption of the shared environment when using mirrord. This will be achieved by providing more granular configuration options (for example, filtering traffic by hostname or protocol), and advanced functionality like copy-on-write for databases.

### Can I use mirrord to run a local container, rather than a local process, in the context of the remote Kubernetes cluster?

The only way to do this at the moment is to install the mirrord CLI within the container and change its entrypoint to run the original process using mirrord. Support for running containers directly with mirrord will be added in the future - please follow [this issue](https://github.com/metalbear-co/mirrord/issues/1658) for updates.

### What if I can't create containers with the capabilities mirrord requires in my cluster?

mirrord works by creating an agent on a privileged pod in the remote cluster that accesses another pod's namespaces (read more about it [here](https://metalbear.co/blog/getting-started-with-ephemeral-containers/)).
If you can't give your end users permissions to create pods with the capabilities mirrord needs, we suggest trying out [mirrord for Teams]({{< ref "/docs/teams/introduction" >}} "mirrord for Teams"). It adds a Kubernetes operator that acts as a control plane for mirrord clients, and lets them work with mirrord without creating pods themselves.
If mirrord for Teams doesn't work for you either, [let us know](hello@metalbear.co) and we'll try to figure a solution that matches your security policies.

## Limitations

### What frameworks/languages does mirrord support?

mirrord works by [hooking libc](https://metalbear.co/blog/mirrord-internals-hooking-libc-functions-in-rust-and-fixing-bugs/), so it should work with any language/framework that uses libc (vast majority).

This includes: Rust, Node, Python, Java, Kotlin, Ruby, and others (most languages use libc).

mirrord also supports for [Go](https://metalbear.co/blog/hooking-go-from-rust-hitchhikers-guide-to-the-go-laxy/), which doesn't use libc

### Does mirrord support clusters with a service mesh like Istio or Linkerd?

Yes. However, traffic mirroring isn't currently supported - you can use the `--steal` flag to steal traffic instead.

### Does mirrord support OpenShift?

Yes, mirrord works with OpenShift. However, OpenShift usually ships with a default security policy that doesn't let mirrord create pods.
To fix this, you would need to tweak your `scc` settings - more information [here](https://docs.openshift.com/container-platform/3.11/admin_guide/manage_scc.html).
If you'd rather keep the default security policies, we recommend trying out [mirrord for Teams]({{< ref "/docs/teams/introduction" >}} "mirrord for Teams"). See [this question](#i-cant-create-privileged-container-in-my-cluster) for more info.

## Comparisons

### Why not just use a remote debugger?

When you use a remote debugger, you still have to deploy new code to the cluster. When you plug local code into the cloud with mirrord, you don't have to wait for cloud deployment. Using mirrord is also less disruptive to the cluster, since the stable version of the code is still running and handling requests.

### Why not just run a copy of the cluster on my machine with e.g. minikube?

Our assumption is that some environments are too complex to run wholly on your local machine (or their components are just not virtualizable). If that's the case with your environment, you can only run the microservice you're currently working on locally, but connect it to your cloud environment with mirrord. Note that mirrord can also be used to connect your non-containerized process to your local Kubernetes cluster.
### How is mirrord different from Telepresence?

mirrord can be a great alternative to Telepresence. The main differences are:
* mirrord works on the process level, meaning it doesn't require you to run a "daemon" locally and it doesn't change your local machine settings. For example, if you run another process, it *won't* be affected by mirrord.
* This means that you can run **multiple** services at the same time, each in a different context and without needing to containerize them.
* mirrord doesn't require you to install anything on the cluster.
* mirrord duplicates traffic and doesn't intercept/steal it by default.
* mirrord can be run through one of our IDE extensions: we support [IntelliJ](https://plugins.jetbrains.com/plugin/19772-mirrord) and [VS Code](vscode:extension/MetalBear.mirrord).

More details can be found in this [GitHub discussion.](https://github.com/metalbear-co/mirrord/discussions/154#discussioncomment-2972127)



## Common Issues

### I've run my program with mirrord, but it seems to have no effect

There are currently two known cases where mirrord cannot load into the application's process:
1. Statically linked binaries. Since mirrord uses the dynamic linker to load into the application's process,
   it cannot load if the binary is statically linked. Support for statically linked
   binaries is planned for the long term, but for now you would have to make sure your binaries are dynamically
   linked in order to run them with mirrord.
   With Go programs, for example, it is as simple as adding `import "C"` to your program code.
   If you don't want to add an import to your Go program, you can alternatively build a dynamically linked binary using `go build -ldflags='-linkmode external'`. In VSCode, this can be done by adding `"buildFlags": "-ldflags='-linkmode external'"` to your `launch.json`.
   On Linux, using `go run` is not possible at the moment - please follow [this issue](https://github.com/metalbear-co/mirrord/issues/1922) for updates.   
2. If you are running mirrord on MacOS and the executable you are running is protected by
   [SIP](https://en.wikipedia.org/wiki/System_Integrity_Protection) (the application you are developing wouldn't be,
   but the binary that is used to execute it, e.g. `bash` for a bash script, might be protected), mirrord might have trouble loading into it (mirrord can generally bypass SIP, but there are still some unhandled edge cases). If that is the case, you could try copying the binary you're trying to run to an unprotected directory (e.g. anywhere in your home directory), changing the IDE run configuration or the CLI
   to use the copy instead of the original binary, and trying again. If it still doesn't work, also remove the signature
   from the copy with:

   ```sudo codesign --remove-signature ./<your-binary>```

   Please let us know if you're having trouble with SIP by opening an issue on [GitHub](https://github.com/metalbear-co/mirrord) or talking to us on [Discord](https://discord.gg/metalbear).

### Incoming traffic to the remote target doesn't reach my local process

This could happen for several reasons:
1. The local process is listening on a different port than the remote target. You can either change the local process to listen on the same port as the remote target (don't worry about the port being used locally by other processes), or use the []`port_mapping`  configuration](/docs/overview/configuration/#feature-network-incoming-port_mapping) to map the remote port to a local port.
2. You're running with `network.incoming.mode` set to `mirror` on a cluster with a service mesh like Istio or Linkerd, which isn't currently supported. In this case, you should use the `--steal` flag instead.


### My local process fails to resolve the domain name of a Kubernetes service in the same cluster

If you've set `feature.fs.mode` to `local`, try changing it to `localwithoverrides`.

When the `local` mode is set, all files will be opened locally. This might prevent your process from resolving cluster-internal domain names correctly, because it can no longer read Kubelet-generated configuration files like `/etc/resolv.conf`. With `localwithoverrides`, such files are read from the remote pod instead.

### Old mirrord agent pods are not getting deleted after the mirrord run is completed

If an agent pod's status is `Running`, it means mirrord is probably still running locally as well. Once you
terminate the local process, the agent pod's status should change to `Completed`.

On clusters with Kubernetes version v1.23 or higher, agent pods are
[automatically cleaned up](https://kubernetes.io/docs/concepts/workloads/controllers/ttlafterfinished/)
immediately (or after a [configurable TTL](/docs/overview/configuration/#agent-ttl)).
If your cluster is v1.23 or higher and mirrord agent pods are not being cleaned up automatically,
[please open an issue on GitHub](
https://github.com/metalbear-co/mirrord/issues/new?assignees=&labels=bug&projects=&template=bug_report.yml&title=Agent%20pods%20lingering%20after%20completion
).
As a temporary solution for cleaning up completed agent pods manually, you can run:
```shell
kubectl delete jobs --selector=app=mirrord --field-selector=status.successful=1
```

### My local process gets permission (EACCESS) error on file access

If your cluster is running on Bottlerocket or has SELinux enabled, please try enabling the `privileged` flag
in the agent configuration:
```json
{
  "agent": {
    "privileged": true
  }
}
```

