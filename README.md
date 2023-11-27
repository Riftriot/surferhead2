# Surferhead

Surferhead is a powerful Web proxy that is **made to be wrapped inside an iframe**. It's an hard fork of [testcafe-hammerhead](https://github.com/DevExpress/testcafe-hammerhead).

> This hard fork is synced from this commit in `master` branch: [7f4279821c8754323fdc7fd6659ebeea45d15131](https://github.com/DevExpress/testcafe-hammerhead/commit/7f4279821c8754323fdc7fd6659ebeea45d15131)

## Core Concepts

`surferhead` is a URL-rewriting proxy. This means that it rewrites all properties of the appropriate JavaScript objects that contain a URL value (`Location`, `HTMLLinkElement.href`, etc). You can see it if you open a proxied page, invoke the browser's DevTools and inspect any element.

In addition, the proxied web page does not know that it is opened under a proxy. The proxy intercepts access attempts to all URL-containing properties and provides the original values.

Also, the proxy can rewrite `window.top` and `window.parent` to make sure the proxied page doesn't know it's opened in a frame (the wrapper).

## First Look

1. Clone the Surferhead repository

    ```cmd
    git clone https://github.com/Vexcited/surferhead.git
    ```

1. Go to the `surferhead` folder

    ```cmd
    cd surferhead
    ```

1. Install the dependencies

    ```cmd
    npm install
    ```

1. Run the [Surferhead playground](./test/playground/server.js) to see our proxy in action

    ```cmd
    node node_modules/gulp/bin/gulp http-playground
    ```

This opens a playground page where you can specify a webpage to proxy in an iframe. Enter the page URL and hit **Attach to iframe**.

## Features

* HTTP/HTTPS requests
* WebSockets, EventSource
* File upload
* Request events (`onRequest`, `onResponse`)
* Bypassing requests

## API in the wrapper window

### `postMessage`

Messages are JSON objects with the following fields:

* `type` - a message type. The available message types are listed below.
* `data` - data to pass in the type. The data type depends on the message type.

You should send messages with the `*` target origin.

### `surferhead:top.history.forward`

Forwards the top window to the next page in the history.

There's no data to pass in this message type.

### `surferhead:top.history.back`

Goes back to the previous page in the top window's history.

There's no data to pass in this message type.

## Reporting Issues and Contributing

Read our [Contributing Guide](./CONTRIBUTING.md) to learn how to contribute to the project.
