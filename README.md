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
  - The server is located at `http://localhost:3001`.

> Note: This server is only required for development to bypass CORS for GitHub.com

If you want to see what Document That looks on a mobile device or share it with a friend, do this:

- Install `nginx`, `ngrok`, and `mkcert`. The first is to provide HTTPS for Next.js and Hasura. The second is to provide the actual proxy. The third is to create self-signed cert that is recognized by the browser. If you're running Linux or Mac, you can install all three via [Homebrew](https://brew.sh/). Just install `homebrew` first, and then run `brew install nginx ngrok mckert`.

- Open one terminal and run `ngrok http 443`. It will output a subdomain like this. `40e7-73-75-45-179.ngrok.io`.

- In a second terminal, run `sh proxy.sh`.

You can now access Document That on your mobile device at `https://eff5-73-75-45-179.ngrok.io`.

## Host Document That yourself

Document That is a static React application. Hence, it can be hosted anywhere. Our recommendation is Netlify. That is because:

- It is a free service with a generous free tier.
- It includes a free proxy to bypass CORS. Hence, there is no need to deploy your own proxy server.
- The deployment is nearly automatic. This is due to `netlify.toml` and `_headers`. You just need to set these environmental variables on Netlify:

  - Required: `NEXT_PUBLIC_CONTACT_EMAIL`. The email you can be contacted at. Ex: `contact@foo.dev`.
  - Optional: `NEXT_PUBLIC_SERVER_DOMAIN`. Your proxy server domain. Ex: `https://api.foo.dev`.

If you want to deploy Document That somewhere else, that is totally fine! For example, you can deploy it on Vercel.com, Render.com, etc. However, you'll need to set up your own proxy server to bypass CORS if you do so. That is because Document That:

- Is an application that connects to GitHub.com using `git` in the browser
- But GitHub.com does not relax CORS for this type of application.

Hence, to bypass CORS, you'll need to host your own proxy server. For example, here's a proxy server that you can deploy using Render.com. It's the same one you run when developing Document That locally. Feel free to adapt these instructions to another hosting provider!

Deploying the proxy server using Docker on Render.com:

- Set `https://github.com/successible/document-that.git` as your `Public Git repository`
- Set `Docker` as your environment.
- Set `/healthz` as your build path.
- Create these environmental variables:
  - `NODE_ENV`. Set it to be `production`.
  - `CLIENT_DOMAIN`. The domain of your client. Ex: `https://api.foo.dev`
