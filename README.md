# node-oracledb-on-m1-mac

The purpose of this repo is to document the steps I took to connect to my university's Oracle database and perform a GET request using `node-oracledb` on my M1 Mac. Additionally, the program needs to be able to run without any code changes. The following steps should also work for Windows users. The only real differences would be the specifics on installing Node.js/`nvm` and Instant Client.

## Clone this repo

Pretty self-explanatory. Clone this repo to a directory of your choosing on your machine.

## Install the x64 version Node.js/NVM using Rosetta

Rosetta is a terminal that you can open on Apple Silicon machines that emulates the x64 architecture. The `node-oracledb` is needed if you want to create a Node.js backend but the package doesn't play nice on M1 Mac at this time. (I mean it's only been 2+ yrs. I'm sure they'll get around to it.)(That was sarcasm. Why does Oracle hate Apple Silicon? Beats me.) Rosetta is always spoken of vaguely and I haven't spent the time yet to find a simple way of switching between native and Rosetta terminals. I'll describe how I'm doing it because although it will be referenced in a link I'm about to provide, their description will not be very helpful if this is your first time.

To open a Rosetta terminal:
- Close any existing terminals
- Open `Finder` and go to `Applications` -> `Utilities`
- Two-figure click `Terminal` and select `Get Info`
- Check the box for `Open using Rosetta`
- Open a new terminal and run `arch`
- The output should be `i386`

Now that you know how to open a Rosetta terminal, following the instructions [here](https://gist.github.com/LeZuse/bf838718ff2689c5fc035c5a6825a11c). Currently, the only way I know how to switch between native and Rosetta terminals is completing the mentioned steps and checking/unchecking the box. I'll update once I figure out a better way or please share if you know a better way.

## Install Node.js packages

Here, we will install the Node.js packages needed to run the server. In the next section I'll address Oracle Instant Client.

- Open a terminal in the parent directory of the repo you cloned (i.e., `node-oracledb-on-m1-mac`)
- Run `nvm use intel` to use the x64 version
- Run ` cd back-end`
- Run `npm init -y`
- Run ` npm i --save express`
- Run ` npm i --save-dev nodemon dotenv oracledb`

But it won't work yet.

## Install Oracle Instant Client

If you were paying attention to the output of the last command, you should've seen something about `node-oracledb` needing to have access to Oracle Libraries and/or Instant Client. The offical documentation can be found [here](https://node-oracledb.readthedocs.io/en/latest/user_guide/installation.html#scripted-installation) but I preferred [this blog](https://blogs.oracle.com/opal/post/avoiding-the-dpi-1047-error-with-nodejs-node-oracledb-5-on-macos-and-windows). Same steps written by the same person, just worded a little different. (The author actually responded to my Stack Overflow posting and was very helpful. Apparently not all people on Stack Overflow are toxic trolls. Who would've guessed?)

You should take note that this approach stores the Instant Client package in your `Downloads` folder. I hate having things in my `Downloads` directory so I moved it to the parent of the `node-oracledb-on-m1-mac` directory, a directory where I keep all my projects called `workspaces`. Because of that, you will likely need to edit this line in the `server.js` file,
```
oracledb.initOracleClient({libDir: process.env.HOME + '/workspaces/instantclient_19_8'});
```

## Create a .env file

I used a `.env` file to store my Oracle DB credentials and connection string. For reasons I don't currently understand, this file needs to be stored in the `back-end` directory and not the `node-oracledb-on-m1-mac` on my Mac but I can store in the `node-oracledb-on-m1-mac` on my Windows machine.

The contents of the `.env` should be the following:
```
USER_NAME="Username"
DB_PASSWORD="Password"
CONNECTION_STRING='//Hostname/SID'
```

Assuming you've already connected to your database using Oracle SQL Developer, you can find this information by two-fingure clicking your database that's listed in `Oracles Connections` and selecting `Properties...`.

## Connecting to the database and running the GET request

I created a simple table called `customers` for testing this out. You can create one too, create a different table, etc. but you'll need to update the query string if your table is named something different. 

To start the server, do the following:
- `cd back-end` (if not already there)
- `node server.js`

It should now print the following in the terminal:
```
Listening to port 5000
Successfully created connection pool
```

To run the GET request, open a browser and go to `localhost:5000/get-customers`. You should now see the metadata and contents of your table.

## Closing

This was done purely so that I could use my M1 Mac on a school project. I have a good Windows machine but after spending 40 hrs a week working on a Windows machine I prefer to spend my evenings doing my school work on my Mac. (The different keyboard, UI, etc. helps me ignore the fact I'm writing code, reading documentation, or in meetings 12-14 hrs a day between work and school.) Also, none of this is my original work. I was simply stubborn enough to keep looking for a solution to this issue and have aggragated my findings into this repo. Hopefully I didn't forget any steps! If something isn't working or you know of a better way, let me know! YouTube failed me and it took a while to piece things together. This might work but it can certainly be optimized.
