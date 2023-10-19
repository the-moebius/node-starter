
# Node.js service starter project

> Replace the content of this file with your own README.


## Replacement keys

Replace the following strings across the entire project
with your own:

- `node-starter` — name of the project

Then, remove this section.


## Environment variables

This project uses dotenv for development configuration.
Use the provided [.env.dist](./.env.dist) file to initialize
your local configuration:

```shell
cp ./.env.dist ./.env
```


## Docker Compose

This project uses [Docker Compose](https://docs.docker.com/compose/)
to provision development dependencies, like databases, caching layers
and other services.

Make sure to start services from
[dev/docker-compose.yml](./dev/docker-compose.yml) file,
before running the application locally.


## Running from IDE

You can run server/commands locally from your IDE:

- Set Node.js argument:
  `--loader ts-node/esm`

- Set environment variable:
  `TS_NODE_PROJECT=tsconfig.app.json`


## License (MIT)

@TODO — DON'T FORGET TO UPDATE THE LICENSE!

Copyright © 2021—2023 Moebius, Slava Fomin II

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
