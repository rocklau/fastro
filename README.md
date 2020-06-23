![fastro][logo]

![ci][ci]

**Fastro** is web framework for developers who are obsessed with simplicity & performance.

It is inspired by [Express](https://expressjs.com/), [Fastify](https://www.fastify.io/), [Nest](https://nestjs.com/) & [Firebase](https://firebase.google.com/).

```ts
import { Fastro } from "https://raw.githubusercontent.com/fastrodev/fastro/v0.12.1/mod.ts";
const server = new Fastro();
server.get("/", (req) => req.send("root"));
await server.listen();
```

## Benchmarks
If performance is **really important** to you, here are the `Hello World` benchmark results. Check [this folder](https://github.com/fastrodev/fastro/tree/master/benchmarks) to see the details.

| Framework | Req/s Avg | Router? | Version |
| :-- | --: | :--: | :-- |
| [Deno http](https://github.com/fastrodev/fastro/blob/master/benchmarks/deno_http.ts) | [14888.8](https://github.com/fastrodev/fastro/blob/master/benchmarks/benchmark_deno.json) | &#10007; | 1.1.1 |
| [Node http](https://github.com/fastrodev/fastro/blob/master/benchmarks/node_http.js) | [14800.6](https://github.com/fastrodev/fastro/blob/master/benchmarks/benchmark_node.json) | &#10007; | 14.3.0 | 
| [**Fastro**](https://github.com/fastrodev/fastro/blob/master/benchmarks/fastro.ts) | **[13830.4](https://github.com/fastrodev/fastro/blob/master/benchmarks/benchmark_fastro.json)**  | **&#10003;** | **0.12.1** |
| [Fastify](https://github.com/fastrodev/fastro/blob/master/benchmarks/fastify.js) |  [12568.6](https://github.com/fastrodev/fastro/blob/master/benchmarks/benchmark_fastify.json) | &#10003; | 2.15.0 |
| [Abc](https://github.com/fastrodev/fastro/blob/master/benchmarks/abc.ts) | [10989.8](https://github.com/fastrodev/fastro/blob/master/benchmarks/benchmark_abc.json) | &#10003; | 1.0.0-rc10 |
| [Oak](https://github.com/fastrodev/fastro/blob/master/benchmarks/oak.ts) | [10071.4](https://github.com/fastrodev/fastro/blob/master/benchmarks/benchmark_oak.json) |  &#10003; | 5.2.0 |
| [Express](https://github.com/fastrodev/fastro/blob/master/benchmarks/express.js) | [6793.73](https://github.com/fastrodev/fastro/blob/master/benchmarks/benchmark_express.json) | &#10003; | 4.17.1 |
| [PHP](https://github.com/fastrodev/fastro/blob/master/benchmarks/index.php) | [5758](https://github.com/fastrodev/fastro/blob/master/benchmarks/benchmark_php.json) |  &#10007; | 7.3.11 |
| [Python Flask](https://github.com/fastrodev/fastro/blob/master/benchmarks/flask_app.py) | [553.4](https://github.com/fastrodev/fastro/blob/master/benchmarks/benchmark_flask.json) | &#10003; | 1.1.2 |


## How to use

This module uses the git release. If you want to pick a specific version, for example `0.12.1`, then the full url is:

```
https://raw.githubusercontent.com/fastrodev/fastro/v0.12.1/mod.ts
```

If you do not use the version, it will refer to `master` branch. Breaking changes may be made without warning.

## Middleware

You can add new properties or functions for specific URL to the default `request`. This is similar to the [express middleware](https://expressjs.com/en/guide/writing-middleware.html).
```ts
const middleware = (req: Request, done: Function) => {
  req.oke = () => req.send("oke");
  done();
};

server
  .use(middleware)
  .get("/", (req) => req.oke());
```

## Decorator

Another way to add a new property or function globally to the fastro instance and `request` object is to use a decorator. This is similar to the [fastify decorator](https://www.fastify.io/docs/latest/Decorators/).
```ts
server
  .decorate((instance) => instance.ok = "ok")
  .decorate((instance) => instance.hello = (payload: string) => payload)
  .decorateRequest((req) => req.oke = "oke request");

server
  .get("/", (req) => req.send(server.ok))
  .get("/hello", (req) => req.send(server.hello("hello")))
  .get("/oke", (req) => req.send(req.oke));
```

## Plugin
You can add new properties or functions to the fastro instance. You can also use all default instance functions, include decorator, create routes & middleware. This is similar to the [fastify plugin](https://www.fastify.io/docs/latest/Plugins/).
```ts
const routes = function (fastro: Fastro, done: Function) {
  fastro
    .get("/", (req) => req.send("root"))
    .post("/", (req) => req.send("post"))
    .put("/", (req) => req.send("put"))
    .delete("/", (req) => req.send("delete"));
  done();
};

server.register(routes);

```

## Dependency Injection
With dependency injection you can create complex applications with clean code. No longer need to manually import handlers and services. You only make a class and add [typescript decorator](https://www.typescriptlang.org/docs/handbook/decorators.html) to define `gateway`, `controller`, `service`  and `route`. Fastro will automatically load, register and create them for you. This is similar to [nest](https://nestjs.com/).

```ts
import { Controller, Get, Request } from "https://raw.githubusercontent.com/fastrodev/fastro/v0.12.1/mod.ts";

@Controller()
class Greet {

  @Get()
  handler(req: Request) {
    req.send("root");
  }
}
```

## Function
With functions, you only need to define the main url and the handler. There is no need to define a method, so you can use all types of http methods. You can also get the url parameters more dynamically without defining the full url.
```ts
server.function("/prefix/function", (req) => {
  if (!req.url.includes("/prefix/function")) return server.forward(req);
  req.send(req.functionParameter);
});

```

## Command line interface
fastro-cli is only used for `fastro-function`.

Install fastro-cli:
```
deno install -f --allow-net --allow-write --allow-read https://raw.githubusercontent.com/fastrodev/fastro/v0.12.0/cli/fastro.ts
```
Create config file and initial handler:
```
mkdir app && cd app && fastro init
```
Run server:
```
fastro serve
```
You can access app root via url:
```
http://localhost:3000/app
```

You can access the handler via url:
```
http://localhost:3000/app/hello
```
You can change the default app and handler by updating the file generated from `fastro init`.

## Examples

Check [this folder](https://github.com/fastrodev/fastro/tree/master/examples) to find out how to:
- [create hello world app](https://github.com/fastrodev/fastro/blob/master/examples/hello.ts)
- [change default port & add optional listen callback](https://github.com/fastrodev/fastro/blob/master/examples/main.ts#L34)
- [send simple text & json data](https://github.com/fastrodev/fastro/blob/master/examples/main.ts#L5)
- [get url parameters](https://github.com/fastrodev/fastro/blob/master/examples/main.ts#L20)
- [get json/text payload from post method](https://github.com/fastrodev/fastro/blob/master/examples/main.ts#L30)
- [set custom http headers & status](https://github.com/fastrodev/fastro/blob/master/examples/main.ts#L9)
- [create simple jwt auth](https://github.com/fastrodev/fastro/blob/master/examples/simple_jwt_auth.ts)
- [create middleware](https://github.com/fastrodev/fastro/blob/master/examples/middleware.ts)
- [create decorator to add new property](https://github.com/fastrodev/fastro/blob/master/examples/decorate.ts)
- [create router with plugin](https://github.com/fastrodev/fastro/blob/master/examples/plugin.ts)
- [create nested plugin](https://github.com/fastrodev/fastro/blob/master/examples/nested_plugin.ts)
- [create simple REST API](https://github.com/fastrodev/fastro/blob/master/examples/crud_postgres.ts)
- [create simple REST API with JWT](https://github.com/fastrodev/fastro/blob/master/examples/rest_api_jwt)
- [create dependency injection](https://github.com/fastrodev/fastro/blob/master/examples/di)
- [create fastro function](https://github.com/fastrodev/fastro/blob/master/examples/function.ts)
- [use command line interface](https://github.com/fastrodev/fastro/blob/master/examples/app)

[logo]: https://repository-images.githubusercontent.com/264308713/62a90180-b2fb-11ea-9299-9a5bc12daca2 "Fastro"
[ci]: https://github.com/fastrodev/fastro/workflows/ci/badge.svg "ci"
