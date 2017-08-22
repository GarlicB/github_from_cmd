github_from_cmd
========

*Still incomplete version*

'github_from_cmd' allows user to use the [github API](https://developer.github.com/v3/) from the command line.
So simple javascript. Import the 'https' and send the data to access the github API.
It makes functions of github possible on the command line, giving it a little convenience.

For use, it require your github ID and PW for each connection.
So inevitably there is a [basic authentication](https://developer.github.com/v3/auth/#basic-authentication)
for [creating a token](https://developer.github.com/v3/oauth_authorizations/#create-a-new-authorization)
that will replace PW in first run.  

## Installation

    npm install github_from_cmd -g  
    gfc [option] [params]


After the global installation, you can run this module with 'gfc'
because the variable was added to '/ usr / local / bin'
by the bin in package.json.  


If you prefer to a local installation, do this.

    node ./node_modules/github_from_cmd/main.js

If not, you can add the script command to package.json in your git folder.

    In your package.json...

    "scripts": {
      "gfc": "node ./node_modules/github_from_cmd/main.js"
    }

    And then-

    npm run gfc [options]

## Usage
*More features coming soon*
<br />  

**[Create pull-request](https://developer.github.com/v3/pulls/#create-a-pull-request)**  

    gfc pr [base branch]
    ex) gfc pr master

As described in the API, 'head' is your branch in the local repo.
'base' is the branch where you want to send pull-request as shown above.
Even if your local repo is a 'forked repo', fine.
It is possible by setting value saved in .git-config.

<br />

**Cheery-Pick of the pull-request**  

    gfc cp [number]
    ex) gfc cp 385

    


Fetches a specific number of pull-requests into a new branch.
Strictly speaking, it does not use the github api. Just use the child process module.
git fetch https://github.com/:users/:repo pull/:num/head:[branch name]


## License

   MIT
