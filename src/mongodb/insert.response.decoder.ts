let insertResponseDecoder = new Map();

insertResponseDecoder.set(-1, '❌ Invalid Key ❌');
insertResponseDecoder.set(0, '✅ Success ✅');
insertResponseDecoder.set(2, '✅ New API key added ✅');
insertResponseDecoder.set(3, '❌ Issue with fetching account name ❌');
insertResponseDecoder.set(4, '❌ Issue with database ❌');
insertResponseDecoder.set(5, '❓ Unknown error ❓');

export default insertResponseDecoder;
