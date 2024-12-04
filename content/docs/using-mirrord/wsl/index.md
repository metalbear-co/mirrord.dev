---
title: "WSL"
description: "Installing and using mirrord on windows with WSL."
date: 2024-12-03T13:37:00+00:00
lastmod: 2024-12-04T13:37:00+00:00
draft: false
menu:
  docs:
    parent: "using-mirrord"
weight: 150
toc: true
tags: ["open source", "team", "enterprise"]
---

# Running mirrord on Windows

Using mirrord on Windows requires setting up the _Linux Subsystem for Windows_ (_WSL_).
You’ll also need a Kubernetes cluster. If you don’t have one, you can set one up locally
using [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/).
mirrord works with any Kubernetes cluster, be it remote or local.

## Setting up WSL

You can read about the prerequisites and installation options on the official Microsoft
documentation for
[How to install Linux on Windows with WSL](https://learn.microsoft.com/en-us/windows/wsl/install). 

The mirrord guide uses the default installation options, which has Ubuntu as the Linux distro.
mirrord itself is not limited to any particular distro.

### From the Microsoft Store

To install WSL from the Microsoft Store just open the Microsoft Store app, then search for
the name of the Linux distro you want. We recommend installing Ubuntu, but mirrord works
with any Linux distro.

![microsoft store install Ubuntu](./images/ms-store-install-ubuntu "Install Ubuntu from the Microsoft store")

After installation is complete, click on the Open button and a terminal window will appear.

![microsoft store open Ubuntu](./images/ms-store-open-ubuntu "Open Ubuntu from the Microsoft store")

### From the Terminal

Open a terminal with **administrator privileges**.

![open terminal with administrator privileges](./images/open-terminal-administrator "Open terminal with administrator privileges")

- It doesn’t have to be the Windows Terminal. PowerShell and Command Prompt will also work.

On the terminal, run the `wsl –install` command to install the default (Ubuntu) Linux distro:

```powershell
wsl --install
```

- You can read more about the prerequisites and installation options on the official Microsoft
 documentation for
 [How to install Linux on Windows with WSL](https://learn.microsoft.com/en-us/windows/wsl/install).
 This guide uses the default installation options, which has Ubuntu as the Linux distro.
 mirrord itself is not limited to any particular distro.

After installing WSL, in a terminal window, you should see the following output from
executing the `wsl --list` command:

```powershell
C:\> wsl --list
Windows Subsystem for Linux Distributions:
Ubuntu (Default)
```

- If you're not seeing any Linux Distribution listed, please refer back to the
 [Microsoft guide](https://learn.microsoft.com/en-us/windows/wsl/install), or join our
 [Discord server](link pending) and we'll be happy to help you.

To start a session in WSL, now enter the `wsl` command:

```powershell
wsl
```

### Setting up the Linux distro

After starting a new WSL session (either from the command line, or from the Microsoft Store)
you’ll be prompted to set up a Linux user.
The username and password does not need to match your Windows user.

![setting up Ubuntu](./images/setting-up-ubuntu "Setting up Ubuntu")

After setting up your Linux user, it’s time to prepare the Linux environment for development.
Install the tools needed to access your Kubernetes cluster
(gcloud cli, azure cli, or whatever cli tool you use for authentication and cluster connection).
You’ll also need to install the compilers and project management tools (such as nvm, JDK, dotnet cli)
necessary to run and debug your project.

- Many of those tools may be installed using the Linux distro package manager,
 but some might require manual installation and setup.

Some IDEs may support running in WSL from Windows directly (the IDE is installed on Windows),
such as VS Code and the Intellij family of IDEs, while others may require being installed in Linux itself.

## Kubernetes on WSL

- Setting up a Kubernetes cluster is out of scope for this guide - we’re assuming that you
 have a remote cluster to target with mirrord.
 If you don’t have a Kubernetes cluster to use and still want to try out mirrord,
 we recommend checking out the Docker Desktop guide on
 [Install Docker Desktop on Windows](https://docs.docker.com/desktop/install/windows-install/).

With the tooling out of the way, and after cluster authorization has been set up,
you may check cluster access with `kubectl get all`.

```sh
username@hostname:/mnt/c$ kubectl get all

NAME             	          TYPE    	    CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.96.0.1	     <none>    	       443/TCP    1d
```

- If you got a `command not found` error instead, this means that `kubectl` is not installed.
 Some Kubernetes tools install it as part of their setup,
 but you can also manually install it directly, follow the 
 [official guide](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)
 for installing it on Linux.
 You can also [install it on Windows](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/),
 but this may require changing the `KUBECONFIG` environment variable.
- If you’re not seeing any of your Kubernetes resources, you might need to change your
 Kubernetes configuration.
 Refer to the [`kube config` manual](https://kubernetes.io/docs/reference/kubectl/generated/kubectl_config/) manual.

## Running a project on WSL

Before starting your IDE, it’s recommended that you copy your project files from the
Windows file system to Linux, to avoid performance issues.
The best practice is to have everything inside Linux.

You can do this from the command line (from within Linux, the Windows file system should
be something like `/mnt/{windows-drive-letter}`, so by default it’ll be `/mnt/c`), or from File Explorer.

![accessing linux files from windows explorer](./images/linux-files-from-windwos-explorer "Linux files from Windows Explorer")

### Creating a playground project

- If you already have your own project, you may skip this section.

We’ll provide you with a small playground project here, if you don’t already have your own.
Let's create a sample NodeJS project to use with mirrord, but bear in mind that mirrord is
not limited to any programming languages or frameworks.
In the Linux terminal, navigate to the `home` directory.

```sh
cd ~
```

Create a new `playground` directory.

```sh
mkdir playground && cd playground
```

Install NodeJS (if you haven’t already in the Setting up the Linux Distro section).
First update the package manager.

```sh
sudo apt update
```

Now install the nodejs package.

```sh
sudo apt install nodejs
```

Create a very simple NodeJS program.

```sh
echo "console.log('Hello, mirrord');" > app.mjs
```

Running `node app.mjs` should look something like this.

```sh
username@hostname:~/playground$ node app.mjs
Hello, mirrord
```

We can finally move on to installing and using mirrord.

### Using mirrord in VS Code

- Microsoft provides a very good guide on
 [how to use WSL with VS Code](https://learn.microsoft.com/windows/wsl/tutorials/wsl-vscode).

Open VS Code from Windows, as you normally would, and click on the Remote Explorer.

![vs code remote explorer wsl targets](./images/vscode-remote-explorer "VS Code remote explorer WSL Targets")

Select the Linux distro you have set up, and click on the Connect in Current Window button that appears.

![vs code remote explorer wsl targets connecting to Ubuntu](./images/vscode-remote-explorer-connect-ubuntu "VS Code remote explorer WSL Targets connecting to Ubuntu")

VS Code will notify you it’s starting WSL, and the Remote Explorer will change to indicate you’re connected.

![vs code connected to wsl](./images/vscode-connected-wsl "VS Code connected to WSL")

Now go to the Extensions panel, search for mirrord and install it.

![vs code extensions install mirrord](./images/vscode-install-mirrord "VS Code extensions install mirrord")

- Some of your extensions may appear as disabled, with a button to `Install in WSL`.
 If you want to use these extensions from the WSL VS Code, then you must click the button and install them.

- If you get an error saying that mirrord does not support the Windows platform,
 this means that you’re trying to install it on the Windows VS Code.
 Uninstall the mirrord extension, and follow the previous steps to start the WSL VS Code.

With mirrord installed, open up your project.

![vs code open project in wsl path](./images/vscode-open-project "VS Code open project")

- Keep in mind that you’ll be navigating the directories with Linux style paths.
 If you have not copied your project files to WSL, you can navigate the Windows files from the `/mnt` directory.

Pressing the mirrord button at the bottom to enable it will change the circle from.

![vs code mirrord starts disabled](./images/vscode-mirrord-disabled "VS Code mirrord disabled")

Changes to.

![vs code mirrord clicked changes to enabled](./images/vscode-mirrord-enabled "VS Code mirrord enabled")

Now starting your project will have mirrord hooked into it.

(Include the mirrord gif we have here?)

### Using mirrord from the CLI

In your WSL terminal, you can download and install mirrord by running the following command:

```sh
curl -fsSL https://raw.githubusercontent.com/metalbear-co/mirrord/main/scripts/install.sh | bash
```

- You might get prompted to enter your `root` user password, so we can install it in `/usr/local/bin`.
- If `curl` is not installed in the Linux distro, you can use the distro package manager
 to install it, or download and install it manually from the [curl website](https://curl.se/download.html).

Now to execute your project with mirrord, just run the `mirrord exec` command:

```sh
mirrord exec --target <pod-target> – <process command> 
```

- If you’re using this guide’s playground project your `mirrord exec` command should be:

```sh
mirrord exec --target “targetless” – node app.mjs
```

- You can list the available mirrord targets with the `mirrord ls` command.
 If no targets are being shown, you might not have any Kubernetes resources that can be
 targeted by mirrord, or you might not be using the right Kubernetes context.
 You can check the later with `kubectl config view`, look at the `current-context` and see
 if it’s the intended one.
 You may change the context with the `kubectl config use-context [CONTEXT NAME]` command.

You can use `mirrord exec –help` to list other `exec` options.

### Using mirrord in Intellij

- Jetbrains provides a very good guide on
[how to use WSL with Intellij](https://www.jetbrains.com/help/idea/how-to-use-wsl-development-environment-in-product.html).

Open the Jetbrains IDE you have installed on Windows (the mirrord plugin is available for
every Jetbrains IDE, in this tutorial we’ll show screen caps from Intellij Idea Ultimate, but that’s **not** a requirement).

![intellij idea new window](./images/intellij-new-window "IntelliJ IDEA new window")

Select the WSL option under Remote Development.

![intellij idea remote development wsl](./images/intellij-select-wsl "IntelliJ IDEA select WSL")

Click on the + button (if you already have a project, otherwise select New Project).

![intellij idea open wsl project](./images/intellij-open-wsl-project "IntelliJ IDEA open WSL project")

- Pay attention to the IDE version you’re choosing.
 The recommendation here is to select the same one that you have installed on Windows,
 pay close attention to the version numbers as well (sometimes the _Beta_ version comes selected by default).

Either type the path to your project, or click on the `...` button to open the path picker.

![intellij idea wsl project path](./images/intellij-wsl-project-path "IntelliJ IDEA find project in WSL path")

Now click `Download IDE and Connect` at the bottom.

![intellij idea click download and connect](./images/intellij-download-and-connect "IntelliJ IDEA download and connect to WSL IDE")

The IDE will be downloaded and installed on Linux. After it’s ready, it should automatically open.

![intellij idea wsl project](./images/intellij-wsl-project "IntelliJ IDEA project is open on WSL")

Click on the gear button, select `Plugins` and search the `Marketplace` for “mirrord”.

![intellij idea install mirrord](./images/intellij-install-mirrord "IntelliJ IDEA WSL install mirrord from marketplace")

After clicking to install it, the install button will change to `Restart IDE`.
Instead of restarting it like that, close the WSL IDE, and in the Windows IDE select to open your project again.

![intellij idea restarted after plugin install](./images/intellij-restart-wsl-ide "IntelliJ IDEA restart WSL IDE after installing mirrord")

- If you get an error saying that mirrord does not support the Windows platform,
 this means that you’re trying to install it on the Windows IDE. Uninstall the mirrord extension,
 and follow the previous steps to start the WSL IDE.

Pressing the mirrord button at the top to enable it will change the icon from.

![intellij idea mirrord disabled](./images/intellij-mirrord-disabled "IntelliJ IDEA click to enable mirrord")

Changes to.

![intellij idea mirrord enabled](./images/intellij-mirrord-enabled "IntelliJ IDEA mirrord enabled")

Now starting your project will have mirrord hooked into it.

(Include the mirrord gif we have here?)
