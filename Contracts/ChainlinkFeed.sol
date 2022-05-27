// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {
    AggregatorV3Interface internal priceBNBFeed;
    AggregatorV3Interface internal priceBTCFeed;
    AggregatorV3Interface internal priceETHFeed;
    AggregatorV3Interface internal priceLINKFeed;
    AggregatorV3Interface internal priceMATICFeed;
    AggregatorV3Interface internal priceUSDCFeed;

    constructor() {
        priceBNBFeed = AggregatorV3Interface(0x82a6c4AF830caa6c97bb504425f6A66165C2c26e);
        priceBTCFeed = AggregatorV3Interface(0xc907E116054Ad103354f2D350FD2514433D57F6f);
        priceETHFeed = AggregatorV3Interface(0xF9680D99D6C9589e2a93a78A04A279e509205945);
        priceLINKFeed = AggregatorV3Interface(0xd9FFdb71EbE7496cC440152d43986Aae0AB76665);
        priceMATICFeed = AggregatorV3Interface(0xAB594600376Ec9fD91F8e885dADF0CE036862dE0);
        priceUSDCFeed = AggregatorV3Interface(0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7);
    }

    function getLatestBNBPrice() public view returns (int) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceBNBFeed.latestRoundData();
        return price;
    }
    function getLatestBTCPrice() public view returns (int) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceBTCFeed.latestRoundData();
        return price;
    }
    function getLatestETHPrice() public view returns (int) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceETHFeed.latestRoundData();
        return price;
    }
    function getLatestLINKPrice() public view returns (int) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceLINKFeed.latestRoundData();
        return price;
    }
    function getLatestMATICPrice() public view returns (int) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceMATICFeed.latestRoundData();
        return price;
    }
    function getLatestUSDCPrice() public view returns (int) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceUSDCFeed.latestRoundData();
        return price;
    }
}