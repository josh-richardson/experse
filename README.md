## Experse

A decentralized forum & aggregator, written by @josh-richardson and @DevdudeSami

#### Current state:

The app is in a good state, but due to the fact that it was written in ~24 hours, the code quality is what you'd expect for a hackathon.

Deployed at: https://arweave.net/BMe8rJRZ9XTrIEvccAuWGtMbgThWPZgbPERC3iUNOHE#/

#### Changelog:
 
V0.1:
- [x] Ability for users to sign up & log in (signing up only involves setting a username, all within Arweave)
- [x] Ability for users to create universes
- [x] Ability for users to create and edit posts within these universes
- [x] Ability to view all edit history
- [x] Ability to up-vote and down-vote posts based on their merit
- [x] User profiles with associated universes and posts
- [x] A rudimentary search function to find content


Future work will likely involve a re-write to allow better usability, maintainability and reliability, as well as better performance, and greater use of asynchronous functions. There will also be caching, and sub-universes which will allow sub-forum like functionality.

#### To run locally:
Clone, then: `npm install && npm run dev`
