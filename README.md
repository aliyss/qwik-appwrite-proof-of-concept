# Workaround to get Qwik running in Appwrite Sites

If you are using this template you don't care much about the below, jump straight to: [Appwrite Setup](#setup-of-appwrite).

## Documentation of the Process

### Figuring out what is called for deployment
1. [frameworks.php](https://github.com/appwrite/appwrite/blob/8a555fd294307a746f4256e889fedc99b0c72444/app/config/frameworks.php) is the file that is being called for the deployment.
2. After checking the [helpers](https://github.com/open-runtimes/open-runtimes/tree/d2d729360823f4b4c6b9a706b64901dc0d22e75f/runtimes/node/versions/latest/helpers) folders, I opted for astro since it had a minimal setup to run.

### bundle.sh
1. The [bundle.sh](https://github.com/open-runtimes/open-runtimes/blob/d2d729360823f4b4c6b9a706b64901dc0d22e75f/runtimes/node/versions/latest/helpers/astro/bundle.sh) basically copies over the required files for everything to run as I see it. I had to take following into consideration:
    - ./dist/astro.config.mjs exists (reason following)
    - ./dist/server/entry.mjs exists (reason following)
    - ./dist/server is within the same folder as client (in this case dist from qwik). If ./server is kept on the top level the `mv /usr/local/build/node_modules/ ./node_modules/` fails.
2. astro.config.mjs and entry.mjs exists
    - Reasoning is for Appwrite to correctly identify SSR. We successfully therefore circumvent this this line: [Builds.php](https://github.com/appwrite/appwrite/blob/b7604a5742d63863fc0ec00255d26b02eb858614/src/Appwrite/Platform/Modules/Functions/Workers/Builds.php#L891).
    - Since entry.mjs exists this now correctly works.
    - For more info check out: [Utopia/Rendering.php](https://github.com/utopia-php/detector/blob/main/src/Detector/Rendering.php).

### server.sh
1. The [server.sh](https://github.com/open-runtimes/open-runtimes/blob/bc299e344becac7a6b3458f05d9c18c39b259002/runtimes/node/versions/latest/helpers/astro/server.sh) runs the start command.
    - by default this is `node ./server.mjs`
    - since this doesn't exist of course and isn't what we want we use the `OPEN_RUNTIMES_START_COMMAND` to bypass it and run with `node server/entry.fastify`.


## Setup 
Setup your project as followed:

### Directory
Standard stuff going on here. Create a folder and `cd` into it.
```bash
mkdir qwik-appwrite-proof-of-concept
cd qwik-appwrite-proof-of-concept/
```

### Initialization
This is also standard. I just initialize the new project as described.
```bash
npm create qwik@latest
```

#### Output
```md
┌  Let's create a  Qwik App  ✨ (v1.17.2)
│
◇  Where would you like to create your new project? (Use '.' or './' for current directory)
│  .
│
●  Creating new project in  /home/aliyss/qwik-appwrite-proof-of-concept  ... 🐇
│
◇  Select a starter
│  Empty App (Qwik City + Qwik)
│
◇  Would you like to install npm dependencies?
│  Yes
│
◇  Initialize a new git repository?
│  Yes
│
◇  Finishing the install. Wanna hear a joke?
│  Yes
```

### Deployment Configuration
Here is where we configure qwik to use fastify. Accept all blindly as you and I usually do.
```bash
npm run qwik add fastify
```

## Postbuild Setup 
Now we want to actually have the output be usable by appwrite.

### Postbuild Script
Check out the file: [postbuild-astro-mimic.js](./scripts/postbuild-astro-mimic.js). I have no clue if all of the files it creates are required, but at this point I got tired so I just created whatever I thought worked.

### Postbuild package.json
Add the execution of the `postbuild-astro-mimic.js` in the postbuild of your [package.json](./package.json). It should now look something like this.
```json
{ 
    "scripts": {
        "build": "qwik build",
        "build.client": "vite build",
        "build.preview": "vite build --ssr src/entry.preview.tsx",
        "build.server": "qwik check-client src dist && vite build -c adapters/fastify/vite.config.ts",
        "postbuild": "node scripts/postbuild-astro-mimic.js",
        "build.types": "tsc --incremental --noEmit",
        "deploy": "echo 'Run \"npm run qwik add\" to install a server adapter'",
        "dev": "vite --mode ssr",
        "dev.debug": "node --inspect-brk ./node_modules/vite/bin/vite.js --mode ssr --force",
        "fmt": "prettier --write .",
        "fmt.check": "prettier --check .",
        "lint": "eslint \"src/**/*.ts*\"",
        "preview": "qwik build preview && vite preview --open",
        "serve": "node server/entry.fastify",
        "start": "vite --open --mode ssr",
        "qwik": "qwik"
    }
}
```
## Setup of Appwrite

### Build settings
Select the following:

- Framework: `Astro`
    - `Server side rendering`
- Settings
    - Install command: `npm install`
    - Build command: `npm run build`
    - Output directory: `./dist`

### Runtime settings
I currently have `Node-22` running. I think this is the default.

### Environment variables

- OPEN_RUNTIMES_START_COMMAND: `node server/entry.fastify`

