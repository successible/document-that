# Document That

⚡ Manage a wiki/blog for free using `git`.

> Note: Document That is licensed under the BSL 1.1 license. Under this license, you can do anything except one thing. Launch a commercial version of Document That. Otherwise, you contribute or use Document That without issue! This license is used by projects such as Sentry.io, MariaDB, CockRoachDB, and so on. You can read more about the license [here](https://open.sentry.io/licensing).

## Develop Document That locally

To run Document That locally on your laptop or desktop, it's very easy. The entire setup process should take less than five minutes.

You just need to:

- Install the following programs:

  - [Git](https://git-scm.com/downloads)
  - [Node.js (19)](https://nodejs.org/en/)

- Fork and clone down the repository via `git clone https://github.com/successible/document-that.git`.

- Run `npm run dev` in the cloned folder to start the client and the server.

  - The client is located at `http://localhost:3050`
  - The server is located at `http://localhost:3001`.

> Note: This server is only required for development to bypass CORS for GitHub.com

If you want to see what Document That looks on a mobile device or share it with a friend, do this:

- Install `nginx`, `ngrok`, and `mkcert`. The first is to provide HTTPS for Next.js and Hasura. The second is to provide the actual proxy. The third is to create self-signed cert that is recognized by the browser. If you're running Linux or Mac, you can install all three via [Homebrew](https://brew.sh/). Just install `homebrew` first, and then run `brew install nginx ngrok mckert`.

- Open one terminal and run `ngrok http 443`. It will output a subdomain like this. `40e7-73-75-45-179.ngrok.io`.

- In a second terminal, run `sh proxy.sh`.

You can now access Document That on your mobile device at `https://eff5-73-75-45-179.ngrok.io`.

## Host Document That on Netlify

Document That is a React application based on Next.js. Hence, it can be hosted anywhere. Our default recommendation is Netlify.com. That is because:

- It is a free service with a generous free tier.
- It includes a free proxy to bypass CORS. Hence, there is no need to deploy your server.
- The deployment is very easy. This is due to `netlify.toml` and `_headers`.

**Instructions:** Deploying Document That as a static site on Netlify.com.

- Set these environmental variables through the Netlify interface:

  - `NEXT_PUBLIC_CONTACT_EMAIL`. The email you can be contacted at. Ex: `contact@foo.dev`.
  - `NETLIFY_NEXT_PLUGIN_SKIP`. Set to `true`. Required for Document That to build on Netlify.

## Host Document That on Render or Digital Ocean

If you do not want to deploy Document That on Netlify, that is totally fine! For example, you can deploy it on Digital Ocean, Render.com, etc. However, you'll need to run Document That as a combined client and server to do so. That is because:

- Document That is an application that connects to GitHub.com using `git` in the browser.
- Yet GitHub.com does not relax CORS for this type of application.

In other words, to bypass CORS, you'll need to run Document That as a server with the ability to proxy requests. Conveniently, the server can also host the React client of Document That.

Here's how you can deploy the server using Render.com. Feel free to adapt these instructions to another hosting provider!

**Instructions:** Deploying Document That as a server on Render.com:

- Set `https://github.com/successible/document-that.git` as your `Public Git repository`
- Set `Docker` as your environment and `/healthz` as your build path.
- Set these environmental variables:
  - Required: `NEXT_PUBLIC_CONTACT_EMAIL`. The email you can be contacted at. Ex: `contact@foo.dev`.
  - Optional: `ENABLE_LOGGING`. Set it to `true` for the server to log requests. Default is `false`.
