import { gql } from "@apollo/client";

export const GET_ALL_PRODUCTS = gql`
 query GettAllProduct{
  products {
    id
    name
    description
    shortDescription
    price
    images {
      detailImage
      gallery
      thumbnail
    }
    rating
    availability
    category
    specifications {
      capacity
      color
      material
      weight
      
    }
  }
}
`;

export const GET_PRODUCTS_CATEGORY = gql`
   query GetProductsCategory {
    productCategories
  }
`;

export const GET_ALL_USERS = gql`
  query getAllusers {
    users {
      _id
      fullname
      email
      password
      role
    }
  }
`;

export const GET_LOGED_IN_USER_INFO = gql`
  query LoggedInUser {
  loggedInUser {
    _id
    fullname
    email
    role
  }
}
`;

export const GET_CART = gql`
  query GetCart($userId: ID, $cartId: String) {
    getCart(userId: $userId, cartId: $cartId) {
      _id
      userId
      cartId
      cartItems {
        _id
        productId
        name
        price
        quantity
        images {
          thumbnail
        }
      }
    }
  }
`;

export const GET_ALL_CONTACT_MESSAGES = gql`
  query GetAllContactMessage {
    getContactMessages {
      _id
      fullName
      email
      subject
      message
      createdAt
    }
  }
`;

export const GET_ORDERS = gql`
  query GetOrders {
    getOrders {
      _id
      userId
      user {
        fullname
        email
      }
      items {
        productId
        name
        price
        quantity
        images {
          thumbnail
        }
      }
      totalPrice
      status
      shippingDetails {
        fullName
        email
        phone
        city
        address
      }
      createdAt
    }
  }
`;

export const GET_SINGLE_MESSAGE = gql`
  query GetSingleMessage($messageId: ID!) {
    getContactMessageById(messageId: $messageId) {
      fullName
      email
      subject
      message
    }
  }
`;



