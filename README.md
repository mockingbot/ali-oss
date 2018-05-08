# ali-oss-slim

modified from: [ali-sdk/ali-oss](https://github.com/ali-sdk/ali-oss)

change:
- use `lib/slimUrllib.js` instead of huge `urllib` package
- drop stream support
- trim required code from `lib/client.js`

remaining base method:
- OSS.Wrapper
  + listBuckets
  + list
  + get
  + put
  + copy
  + delete
  + deleteMulti
