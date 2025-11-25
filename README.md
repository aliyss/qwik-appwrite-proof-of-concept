# Workaround to get Qwik running in Appwrite Sites

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

### Deployment Configuration
Here is where we configure qwik to use fastify. Accept all blindly as you and I usually do.
```bash
npm run qwik add fastify
```

## Setup after Setup
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
