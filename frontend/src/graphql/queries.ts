import { gql } from '@apollo/client';

// Query lấy giá Real-time từ Redis
export const GET_CRYPTO_PRICE = gql`
  query GetCryptoPrice($symbol: String!) {
    getCryptoPrice(symbol: $symbol) {
      symbol
      price
      change_24h
    }
  }
`;

// Query lấy danh sách tài sản trong ví (Postgres) - Sau này dùng
export const GET_MY_ASSETS = gql`
  query GetMyAssets {
    me {
      assets {
        symbol
        amount
        avg_price
      }
    }
  }
`;


// Query lấy danh sách nhiều coin (Dùng cho MarketTable)
export const GET_MARKET_DATA = gql`
  query GetMarketData($symbols: [String!]!) {
    marketPrices(symbols: $symbols) {
      symbol
      price
      change_24h
    }
  }
`;


