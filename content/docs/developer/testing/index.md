---
title: "Testing & Development"
description: "Setup environment for testing and developing mirrord"
date: 2022-06-15T08:48:45+00:00
lastmod: 2022-06-15T08:48:45+00:00
draft: false
images: []
menu:
  docs:
    parent: "testing"
weight: 110
toc: true
---


### Prerequisites

- [Rust](https://www.rust-lang.org/)
- [Nodejs](https://nodejs.org/en/) & [Expressjs](https://expressjs.com/)
- [Python](https://www.python.org/) & [Flask](https://flask.palletsprojects.com/en/2.1.x/)
- Kubernetes Cluster (local/remote)

### Setup a k8s Cluster

A minimal Kubernetes cluster can be easily setup locally using either of the following -
- [Minikube](https://minikube.sigs.k8s.io/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

For the ease of illustration and testing, we will conform to using Docker Desktop for the rest of the guide.
### Docker Desktop

Download [Docker Desktop](https://www.docker.com/products/docker-desktop/)

{{<figure src="mirrord-docker-desktop.png" alt="mirrord - Download Docker Desktop" class="white-background center large-width">}}

Enable Kubernetes in preferences, Apply and Restart

{{<figure src="mirrord-enable-kubernetes.png" alt="mirrord - Download Docker Desktop" class="white-background center large-width">}}

### Preparing a cluster

Switch Kubernetes context to `your-context`

```bash
kubectl config get-contexts
```

```bash
kubectl config use-context your-context
```

<details>
  <summary>View sample output from Docker Desktop</summary>

```bash
❯ kubectl config get-contexts
CURRENT   NAME             CLUSTER          AUTHINFO                               NAMESPACE
          docker-desktop   docker-desktop   docker-desktop
          minikube         minikube         minikube                               default
*         mirrord-test     mirrord-test     clusterUser_mirrod-test_mirrord-test
```

```bash
❯ kubectl config use-context docker-desktop
Switched to context "docker-desktop".
```

</details>

Create a new testing deployment & service

```bash
kubectl apply -f app.yaml
```

<details>
  <summary>app.yaml</summary>

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: http-echo-deployment
  labels:
    app: http-echo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: http-echo
  template:
    metadata:
      labels:
        app: http-echo
    spec:
      containers:
        - name: http-echo
          image: ealen/echo-server
          ports:
            - containerPort: 80
          env:
            - name: MIRRORD_FAKE_VAR_FIRST
              value: mirrord.is.running
            - name: MIRRORD_FAKE_VAR_SECOND
              value: "7777"

---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: http-echo
  name: http-echo
spec:
  ports:
    - port: 80
      protocol: TCP
      targetPort: 80
  selector:
    app: http-echo
  sessionAffinity: None
  type: NodePort
```

</details>

Verify everything was created after applying the manifest

```bash
❯ kubectl get services
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
kubernetes   ClusterIP   10.96.0.1      <none>        443/TCP        3h13m
py-serv      NodePort    10.96.139.36   <none>        80:32095/TCP   3h8m
❯ kubectl get deployments
NAME                 READY   UP-TO-DATE   AVAILABLE   AGE
py-serv-deployment   1/1     1            1           3h8m
❯ kubectl get pods
NAME                                 READY   STATUS    RESTARTS   AGE
py-serv-deployment-ff89b5974-x9tjx   1/1     Running   0          3h8m
```

### Build mirrord-agent

```bash
docker build -t test . --file mirrord-agent/Dockerfile
```

```bash
❯ docker images
REPOSITORY                                     TAG       IMAGE ID       CREATED         SIZE
test                                           latest    5080c20a8222   2 hours ago     300MB
```

### Build & run mirrord

On Nightly toolchain - 

| OSX | `cargo +nightly build --workspace --exclude mirrord-agent` |
| - | - |
| **Linux** | **`cargo +nighty build`** |

Run mirrord with a local process

Sample web server - `app.js`

```js
const express = require("express");
const app = express();
const PORT = 80;

app.get("/", (req, res) => {
  res.send("OK - GET: Request completed\n");
});

app.post("/", (req, res) => {
  res.send("OK - POST: Request completed\n");
});

app.put("/", (req, res) => {
  res.send("OK - PUT: Request completed\n");
});

app.delete("/", (req, res) => {
  res.send("OK - DELETE: Request completed\n");
  });  

var server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
```

```bash

MIRRORD_AGENT_IMAGE=test MIRRORD_AGENT_RUST_LOG=debug RUST_LOG=debug target/debug/mirrord exec -c --pod-name py-serv-deployment-ff89b5974-x9tjx node app.js
.
.
.
2022-06-30T05:14:01.592418Z DEBUG hyper::proto::h1::io: flushed 299 bytes
2022-06-30T05:14:01.657977Z DEBUG hyper::proto::h1::io: parsed 4 headers
2022-06-30T05:14:01.658075Z DEBUG hyper::proto::h1::conn: incoming body is empty
2022-06-30T05:14:01.661729Z DEBUG rustls::conn: Sending warning alert CloseNotify
2022-06-30T05:14:01.678534Z DEBUG mirrord_layer::sockets: getpeername hooked
2022-06-30T05:14:01.678638Z DEBUG mirrord_layer::sockets: getsockname hooked
2022-06-30T05:14:01.678713Z DEBUG mirrord_layer::sockets: accept hooked
2022-06-30T05:14:01.905378Z DEBUG mirrord_layer::sockets: socket called domain:30, type:1
2022-06-30T05:14:01.905639Z DEBUG mirrord_layer::sockets: bind called sockfd: 32
2022-06-30T05:14:01.905821Z DEBUG mirrord_layer::sockets: bind:port: 80
2022-06-30T05:14:01.906029Z DEBUG mirrord_layer::sockets: listen called
2022-06-30T05:14:01.906182Z DEBUG mirrord_layer::sockets: bind called sockfd: 32
2022-06-30T05:14:01.906319Z DEBUG mirrord_layer::sockets: bind: no socket found for fd: 32
2022-06-30T05:14:01.906467Z DEBUG mirrord_layer::sockets: getsockname called
2022-06-30T05:14:01.906533Z DEBUG mirrord_layer::sockets: getsockname: no socket found for fd: 32
2022-06-30T05:14:01.906852Z DEBUG mirrord_layer::sockets: listen: success
2022-06-30T05:14:01.907034Z DEBUG mirrord_layer::tcp: handle_listen -> listen Listen {
    fake_port: 51318,
    real_port: 80,
    ipv6: true,
    fd: 32,
}
Server listening on port 80
```

Send traffic to the Kubernetes Pod through the service

```bash
❯ kubectl get services
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
kubernetes   ClusterIP   10.96.0.1      <none>        443/TCP        3h32m
py-serv      NodePort    10.96.139.36   <none>        80:32095/TCP   3h27m
```

```bash
curl localhost:32905
```

Check the traffic was received by the local process

```bash
.
.
.
2022-06-30T05:17:31.877560Z DEBUG mirrord_layer::tcp: handle_incoming_message -> message Close(
    TcpClose {
        connection_id: 0,
    },
)
2022-06-30T05:17:31.877608Z DEBUG mirrord_layer::tcp_mirror: handle_close -> close TcpClose {
    connection_id: 0,
}
2022-06-30T05:17:31.877655Z DEBUG mirrord_layer::tcp: handle_incoming_message -> handled Ok(
    (),
)
2022-06-30T05:17:31.878193Z  WARN mirrord_layer::tcp_mirror: tcp_tunnel -> exiting due to remote stream closed!
2022-06-30T05:17:31.878255Z DEBUG mirrord_layer::tcp_mirror: tcp_tunnel -> exiting
OK - GET: Request completed
```

### Run E2E tests

Make sure `mirrord-agent` image is tagged as `test`

```bash
docker tag agent-image test
```

Run Cargo test

```bash
cargo test --package tests --lib -- tests --nocapture --test-threads 1
```