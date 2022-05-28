# Heptagon-Chainlink

Heptagon is a Polygon based DeFi dapp that works in tandem with ChainLink, Moralis, IPFS and Rapyd to offer a fiat ramp, price data feeds, cash out and an Instant messenger where you can chat and send tokens and NFTs. 

# Introduction and Problem

Over the last decade, most economies in Latin America and the Caribbean have displayed sustained growth and macroeconomic stability leading to the emergence of growing middle classes. Despite these advances, poverty and inequality levels remain high and financial exclusion still affects important sectors of the population, which can hinder future economic and social development.

El Salvador’s experiment with Bitcoin has justifiably intrigued much of the financial world. That focus might be missing the much larger story. Regardless of the outcome of El Salvador’s cryptocurrency venture, mobile phones, fintech, DeFi, blockchain technology, and cryptocurrency, are poised to dramatically alter banking and commerce, and potentially economic stability, throughout the region.

Nevertheless there are several challenges, an estimated 70% of economic transactions in Latin America are all cash. And just 50% has bank accounts. But, in contrast 78% has a cellphone with internet connection and among those more than 99% use Instant messenger apps. We think that the region is set to jump this chasm and generate new economies based in these technologies such as the jump several countries had from nothing to mobile phones without passing through landlines.

We just need the correct tools, applications and technologies.

# Diagram:

<img src="https://i.ibb.co/SfCYnPG/Scheme-drawio-3.png">

- The main services we are using is Polygon, ChainLink, Moralis, IPFS and Rapyd.
- Polygon is our main blockchain, where thanks to its low fees we can provide the following services.
  - Decentralized Chat.
  - Transfer tokens and NFT's
 - Chainlink, thanks to its data feeds, provides us with the possibility of consuming them directly within a smart contract, in this case we use a contract deployed in Polygon Mainnet as a bridge to provide our dapp with the prices of BTC, BNB, USDC, MATIC, LINK and ETH.
- Moralis provides us with a very efficient API to obtain data from our NFT's and Token balances in our account.
- Rapyd allows us, on your side, to carry out the KYC to use the Fiat services and also to checkout our fiat money through a virtual card or transfer.
- The Swap is the only section where we coordinate Rapyd and Polygon services to be able to exchange MATIC to Fiat money.

# References

https://www.caf.com/en/currently/news/2020/08/inclusion-and-financial-literacy-keys-to-reducing-gaps-in-latin-america-and-the-caribbean/#:~:text=In%20Latin%20America%20and%20the%20Caribbean%2C%20while%20financial%20inclusion%20levels,access%20to%20formal%20financial%20services.

https://iamericas.org/latin-america-in-crypto-defi-cbdc-blockchain-transition/
