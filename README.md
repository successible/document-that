# Document That

⚡ Manage a wiki/blog for free using `git`.

> Note: Document That is licensed under the BSL 1.1 license. Under this license, you can do anything except one thing. Launch a commercial version of Document That. Otherwise, you contribute or use Document That without issue! This license is used by projects such as Sentry.io, MariaDB, CockRoachDB, and so on. You can read more about the license [here](https://open.sentry.io/licensing).

## Develop Document That locally

To run Document That locally on your laptop or desktop, here is what you need to do:

- Install the following programs:

  - [Git](https://git-scm.com/downloads)
  - [Node.js (LTS)](https://nodejs.org/en/)

- Clone down the repository via `git clone https://github.com/successible/document-that.git`.

- Run `npm dev` in the cloned folder to start the client and the server.

  - The client is located at `http://localhost:3050`
  - The server is located at `http://localhost:3001`

If you want to see what Document That looks on a mobile device or share it with a friend, do this:

- Install `nginx`, `ngrok`, and `mkcert`. The first is to provide HTTPS for Next.js and Hasura. The second is to provide the actual proxy. The third is to create self-signed cert that is recognized by the browser. If you're running Linux or Mac, you can install all three via [Homebrew](https://brew.sh/). Just install `homebrew` first, and then run `brew install nginx ngrok mckert`.

- Open one terminal and run `ngrok http 443`. It will output a subdomain like this. `40e7-73-75-45-179.ngrok.io`.

- In a second terminal, run `sh proxy.sh`.

You can now access Document That on your mobile device at `https://eff5-73-75-45-179.ngrok.io`.

## Host Document That yourself

Document That is made up of two components:

- `Client`: TypeScript and React.js.
- `Server`: TypeScript and Node.js.

By design, both components can be easily hosted yourself. We have written instructions for doing so below. These instructions are designed for the hosting provider Render.com. However, they can be easily adapted for another provider. For example: Digital Ocean, Heroku etc.

### Client

Create a Static Site on Render.com with the following configuration:

- `https://github.com/successible/document-that.git` as your `Public Git repository`
- `pnpm run build` as your build command
- `out` as your `Publish directory`.
- These environmental variables:
  - `NEXT_PUBLIC_SERVER_DOMAIN`. The domain of your server. Ex: `https://api.foo.dev`
  - `NEXT_PUBLIC_CONTACT_EMAIL`. The email people can contact you at. Ex: `contact@foo.dev`.

Once deployed, add the following HTTP Headers. This is required for security. Do not forget to replace `mydomain.com` with your domain!

```
/*, Strict-Transport-Security, max-age=31536000; includeSubDomains; preload
/*, X-Frame-Options, deny
/*, X-XSS-Protection, 1; mode=block
/*, X-Content-Type-Options, nosniff
/*, Referrer-Policy, strict-origin
/*, Content-Security-Policy, default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' https://api.mydomain.com https://api.github.com; font-src 'self' https://fonts.gstatic.com; object-src 'none'; base-uri 'none';
```

### Server

Create a Web Service on Render.com with the following configuration:

- `https://github.com/successible/document-that.git` as your `Public Git repository`
- `Docker` as your environment.
- `/healthz` as your build path.
- These environmental variables:
  - `NODE_ENV`. Set it to be `production`.
  - `CLIENT_DOMAIN`. The domain of your client. Ex: `https://api.foo.dev`
