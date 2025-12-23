const typeDefs = `
  type User {
    _id: ID!
    fullname: String!
    email: String!
    password: String!
    role: String!
  }

    type LogoutResponse {
    success: Boolean!
    message: String!
  }

  type Product {
    _id: ID!
    name: String!
    category: String!
    price: Float!   
    rating: Float
    description: String
    shortDescription: String
    images: Image
    specifications: Specification
    availability: String
  }

  type Image {
    thumbnail: String
    gallery: [String]
    detailImage: String
  }

  type Specification {
    capacity: String
    material: String
    color: String
    weight: String
  }

  input UserInput {
    fullname: String!
    email: String!
    password: String!
  }

  input UserSigninInput {
    email: String!
    password: String!
  }

input ProductInput {
  name: String!
  category: String!
  price: Float!
  rating: Float
  description: String
  shortDescription: String
  images: ImageInput
  specifications: SpecificationInput
  availability: String
}

input ImageInput {
  thumbnail: String
  gallery: [String]
  detailImage: String
}

input SpecificationInput {
  capacity: String
  material: String
  color: String
  weight: String
}

  

  type AuthPayload {
  token: String!
  role: String!
}

  type CartItem {
  _id: ID
  productId: ID!
  name: String
  price: Float
  quantity: Int
  images: CartImage
}

type CartImage {
  thumbnail: String
}

type Cart {
  _id: ID!
  userId: ID
  cartId: String
  cartItems: [CartItem]
}

input CartItemInput {
  productId: ID!
  name: String!
  price: Float!
  quantity: Int
  thumbnail: String
}

 type OrderItem {
    productId: ID!
    name: String!
    price: Float!
    quantity: Int!
  }

  type ShippingDetails {
    fullName: String
    email: String
    phone: String
    city: String
    address: String
  }

type Order {
  _id: ID!
  userId: ID
  user: User  # Add this line
  items: [OrderItem!]!
  totalPrice: Float!
  shippingDetails: ShippingDetails
  status: String
  createdAt: String
  updatedAt: String
}

  input OrderItemInput {
    productId: ID!
    name: String!
    price: Float!
    quantity: Int!
  }

  input ShippingInput {
    fullName: String
    email: String
    phone: String
    city: String
    address: String
  }

  type ContactMessage {
    _id: ID!
    fullName: String!
    email: String!
    subject: String!
    message: String!
    createdBy: ID
    createdAt: String
    updatedAt: String
  }

  input ContactMessageInput {
    fullName: String!
    email: String!
    subject: String!
    message: String!
    createdBy: ID
  }





  type Query {
    users: [User]
    loggedInUser: User
    products: [Product]
    productCategories: [String!]!
    getCart(userId: ID, cartId: String): Cart
    getOrders: [Order]
    getUserOrders(userId: ID!): [Order]
    getOrderById(orderId: ID!): Order
    getContactMessages: [ContactMessage]
    getContactMessageById(messageId: ID!): ContactMessage
  }

  type Mutation {
    signupUser(userNew: UserInput!): User
    signinUser(userSignin: UserSigninInput!): AuthPayload!
    logoutUser: LogoutResponse!

    addProduct(productNew: ProductInput!): Product
    updateProduct(productId: ID!, productUpdate: ProductInput!): Product
    deleteProduct(productId: ID!): String

    updateUserRole(userId: ID!, role: String!): User
    deleteUser(userId: ID!): String
    addToCart(userId: ID cartId: String item: CartItemInput!): Cart
    updateCartItem(userId: ID cartId: String productId: ID! quantity: Int!): Cart
    removeCartItem(userId: ID cartId: String productId: ID!): Cart
    clearCart(userId: ID cartId: String): LogoutResponse!
    
    createOrder(userId: ID items: [OrderItemInput!]! totalPrice: Float! shippingDetails: ShippingInput): Order

    updateOrderStatus(orderId: ID!, status: String!): Order
    deleteOrder(orderId: ID!): String
    addContactMessage(contactInput: ContactMessageInput!): ContactMessage
    deleteContactMessage(messageId: ID!): String
  }
`;

export default typeDefs;
