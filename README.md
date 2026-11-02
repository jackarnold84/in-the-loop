# In The Loop

CTA Train and Bus Tracker

Real-time arrival data for selected CTA train and bus routes. Gives second-level
precision with a fast, lightweight UI.

https://jackarnold84.github.io/in-the-loop/

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

#### Reindex
- script to download and reindex all CTA routes and stops (used for searching all stops)
- run `python -m indexer.indexer download`
- results are saved to [index/](/src/config/index/)
- Includes exact stop coordinates used by transfer links on the Follow page.

#### Transfers
- Expand an upcoming stop on Follow and select **Transfer** to see nearby bus and train stations.
- Transfer URLs use `/nearby?stop=<stopId>&run=<runNumber>`; the run is optional.
- Transfers use the selected stop's location and do not require location permission.
- Run `npm test` and `npm run typecheck` to check transfer lookup and navigation behavior.

### Tracker API
Located in [service/](service/) directory
- requirements
  - Go (Golang)
  - AWS CLI + AWS-SAM CLI
  - CTA developer API key for both train and bus access
    - must place credentials at `service/internal/env/credentials.json`
- use [Makefile](service/Makefile) to build, test, and deploy to AWS
