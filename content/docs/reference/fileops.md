---
title: "File Operations"
description: ""
date: 2022-06-15T08:48:45+00:00
lastmod: 2022-06-15T08:48:45+00:00
draft: false
images: []
menu:
  docs:
    parent: "reference"
weight: 110
toc: true
---

#### Overview

mirrord's cli supports enabling file operations using the `--enable-fs` flag. For example, consider the following python script

```py
read_str = ""
with open("/tmp/test", "r+") as rw_file:
    while read_str != TEXT:
        read_str += rw_file.read(1)
print(read_str)
```

being run using mirrord:

```bash
mirrord exec -c --enable-fs --pod-name py-serv-deployment-cfc458fd4-bjzjx python3 test.py
```

which calls python's builtin `open` function. This call to `open` translates to something like `openat(AT_FDCWD, "/tmp/test", O_RDWR|O_CLOEXEC)` at a lower level. mirrord overrirdes this call and opens `/tmp/test` on the remote pod.

Currently, the following operations are supported:

- open
- openat
- fopen
- fdopen
- read
- fread
- fileno
- lseek
- write

#### Description

mirrord overrirdes calls to the following libc functions:

**Note**: On a higher level, when running with `python` or `node` these libc function calls are abstracted through the standard libraries.

##### open

`int open(const char *pathname, int flags);`

Open files on the remote pod. Functionality when opening with different types of paths might differ. In the case when `pathname` is specified to be a relative path, the call to open is sent to libc instead of the remote pod.

Example:

```py
import os 
fd = os.open("/tmp/test", os.O_WRONLY | os.O_CREAT)
```

##### openat

`int openat(int dirfd, const char *pathname, int flags);`

`openat` works the same as `open` when `dirfd` is specified as `AT_FDCWD` or if the path is absolute. If a valid `dirfd` is provided, files relative to the directory referred to by the `dirfd` can be opened.

Example:

```py
dir = os.open("/tmp", os.O_RDONLY | os.O_NONBLOCK | os.O_CLOEXEC | os.O_DIRECTORY)

os.open("test", os.O_RDWR | os.O_NONBLOCK | os.O_CLOEXEC, dir_fd=dir)
```

##### read

`ssize_t read(int fd, void *buf, size_t count);`

Read from a file on the remote pod. If the provided `fd` is a valid file descriptor i.e. it refers to a file opened on the remote pod then the call is forwarded to the remote pod, otherwise if the call is sent to libc.

Example:

```py
fd = os.open("/tmp/test, os.O_RDWR | os.O_NONBLOCK | os.O_CLOEXEC)
read = os.read(fd, 1024)
```

##### write

`ssize_t write(int fd, const void *buf, size_t count);`

Write to a file on the remote pod. If the provided `fd` is a valid file descriptor i.e. it refers to a file opened on the remote pod then the call is forwarded to the remote pod, otherwise if the call is sent to libc.

Example:

```py
with open("/tmp/test", "w") as file:
    file.write(TEXT)
```

##### lseek

`off_t lseek(int fd, off_t offset, int whence);`

Reposition the file offset of an open file on the remote pod. lseek through mirrord-layer supports all valid options for whence as specified in the Linux manpages. If the provided `fd` is a valid file descriptor i.e. it refers to a file opened on the remote pod then the call is forwarded to the remote pod, otherwise if the call is sent to libc.

Example:

```py
with open("/tmp/test", "w") as file:
    file.seek(10)
    file.write(TEXT)
```
