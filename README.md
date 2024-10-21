# El Track

CTA Train and Bus Tracker

Real-time arrival data for selected CTA train and bus routes. Gives second-level
precision with a fast, lightweight UI.

https://jackarnold84.github.io/el-track/

## Develop

### UI
- requirements
  - Node.js and npm
  - Gatsby CLI
- develop locally
  - `npm start`
- build locally
  - `npm build`
- serve on local network
  - `npm run serve`
- deploy to GitHub Pages
  - `npm run deploy`
  - see [gatsby-config.js](gatsby-config.js) for options

#### Customize Routes
- update tripCatalog and tripIndex in [catalog.js](src/config/catalog.js)

### Tracker API
Located in [service/](service/) directory
- requirements
  - Go (Golang)
  - AWS CLI + AWS-SAM CLI
  - CTA developer API key for both train and bus access
    - must place credentials at `service/internal/env/credentials.json`
- use [Makefile](service/Makefile) to build, test, and deploy to AWS
