# Circle User-Controlled Wallets Sample App - Backend Server

Check out the [live demo](https://user-controlled-wallets-sample-app.circle.com/) first to see what to expect!

## Functional Architecture

### User Journeys:

 - Sign Up / Sign In:
    - Frontend form → Backend /onboarding routes → Circle User + Wallet created.
- Browse / Add to Cart:
    - Goods are shown from a content DB (can be mocked for MVP).
- Checkout:
    - Frontend calls backend /transactions/create.
    - Backend invokes Circle SDK for transaction (with gas abstracted).
- Wallet Management:
  - Frontend can show balances (via /wallets/:id/balance).
  - Testnet USDC faucet for demoing.
 
## Logical Architecture

### Frontend (Next.js/React, in your repo)
- Wallet connect UI (sign up/sign in).
- Storefront UI (list, cart, checkout).
- Calls backend APIs for wallet + transaction ops.

### Backend (Express + Circle SDK)
- controllers/onboarding.ts: user lifecycle (create, login, PIN setup).
- controllers/wallets.ts: wallet ops (list, balance, create).
- controllers/transactions.ts: transaction lifecycle (create, get, list).
- controllers/faucet.ts: drip testnet USDC.
- Middleware: schema validation, auth, error handler.
- Services: Circle SDK wrappers.

### Circle Infra
- User-Controlled Wallets API: abstracts wallet creation & custody.
- Paymaster: pays gas on behalf of user.
- USDC on-chain settlement: actual stablecoin payments.

## ARCHITECTURAL DIAGRAM
<img width="1313" height="994" alt="mermaid-diagram-2025-08-30-081659" src="https://github.com/user-attachments/assets/fd42bdc8-5645-4939-b99f-d01b449b9064" />

## Get Started

### Prerequisites

1. Sign up for [Circle's Dev Console](https://developers.circle.com/w3s/docs/circle-developer-account).

2. Set up Testnet API key, see [guide](https://learn.circle.com/quickstarts/user-controlled-wallets#step-1-setting-up-your-testnet-api-key).

3. Install [nvm](https://github.com/nvm-sh/nvm) and [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable), these are required development tools.

4. **_Important:_** Set up [Sample App Frontend UI](https://github.com/circlefin/w3s-sample-user-controlled-client-web) as well to get the end-to-end experience. Please be aware that the [SDK user token](https://developers.circle.com/w3s/reference/getusertoken) will expire after 60 minutes.

### Configure the Sample App

1. Run `yarn env:config`, and you will see a `.env` file generated in the root directory.
2. Paste your [API key](https://console.circle.com/api-keys) into the `.env` file.

Run the following commands to start the server with an in-memory SQLite database at `localhost:8080`:

``` bash
nvm use
yarn install
yarn dev
```

1. `nvm use`: set node version.
2. `yarn install`: install dependencies.
3. `yarn dev`: run the server, hot reload is supported.

## Code Structure

We use [Express](https://expressjs.com/) as web framework and [SQLite](https://www.sqlite.org/) as default database.

- The main logic to interact with Circle Web3 Services Node.js SDK is under `src/controllers`:
  - In `onboarding.ts`, we use the SDK to generate a user token for both our Sign Up and Sign In functions by calling the `createUserToken`:

    ```javascript
      const tokenResponse = await circleUserSdk.createUserToken({
        userId: newUserId
      });
    ```

  - Majority of files under `src/controllers` will require this user token to be passed within the header. For instance, creating a transaction with `circleUserSdk.createTransaction(...)` in  `transactions.ts`, `req.headers` holds the token value and `req.body` holds all the parameters that the client can pass in as an object. Once authorized and configured from the client, the SDK uses Programmable Wallets to send on-chain transactions:

    ```javascript
        const response = await circleUserSdk.createTransaction({
          userToken: req.headers['token'] as string,
          fee: feeConfig,
          idempotencyKey: req.body.idempotencyKey,
          refId: req.body.refId,
          amounts: req.body.amounts,
          destinationAddress: req.body.destinationAddress,
          nftTokenIds: req.body.nftTokenIds,
          tokenId: req.body.tokenId,
          walletId: req.body.walletId
        });
    ```

- Shared logic for the routers live in `src/middleware`:
  - `auth.ts`: logic to parse and validate user token
  - `errorHandler.ts`: logic to handle errors
  - `validation.ts`: logic to handle incoming parameter type
  
- `src/services` holds external resources that the server needs:
  - `userControlledWalletSdk.ts`: will initialize an instance of the user-controlled wallet sdk to be used by the controllers.
  - `db/`: configures the Sqlite database for the user credentials.
- `src/app.ts` sets up the express router configurations and sets the base path and sub paths for the controllers. Imported by `src/index.ts` as the entry point of the server.
