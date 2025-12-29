import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Product from "./models/Product.js";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import Cart from "./models/Cart.js";
import Order from "./models/Order.js";
import ContactMessage from "./models/ContactMessage.js";
import { AuthenticationError } from "apollo-server-errors";

const resolvers = {
  Query: {
    // Get All Users
    users: async () => {
      return await User.find();
    },

    // Get LogedIn user Info
    loggedInUser: async (_parent, _args, context) => {
      if (!context.user) throw new AuthenticationError("Not authenticated");

      const user = await User.findById(context.user.userId); // use userId from token
      if (!user) throw new AuthenticationError("User not found");

      return {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      };
    },

    // Get All Products
    products: async () => {
      return await Product.find();
    },

    productCategories: async () => {
      try {
        const products = await Product.find().select("category");
        const categories = products.map((p) => p.category);
        return Array.from(new Set(categories));
      } catch (err) {
        console.error("Error fetching categories:", err);
        return [];
      }
    },

    // Get Cart Items
    getCart: async (_, { userId, cartId }) => {
      const cart = await Cart.findOne(userId ? { userId } : { cartId });
      return cart;
    },

    // Admin all orders
   getOrders: async (_, __, context) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "userId",
        select: "fullname email",
        model: "User"
      })
      .lean();

    return orders.map((order) => ({
      ...order,
      user: order.userId ? {
        _id: order.userId._id,
        fullname: order.userId.fullname,
        email: order.userId.email
      } : null,
      createdAt: order.createdAt?.toISOString?.() || order.createdAt,
      updatedAt: order.updatedAt?.toISOString?.() || order.updatedAt
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
},

    // User own orders
    getUserOrders: async (_, { userId }) => {
      return await Order.find({ userId }).sort({ createdAt: -1 });
    },

    // Single order
    getOrderById: async (_, { orderId }) => {
      const order = await Order.findById(orderId)
        .populate("userId", "fullname email")
        .lean();

      if (!order) {
        throw new Error("Order not found");
      }

      return {
        ...order,
        user: order.userId,
      };
    },

    // Admin: fetch all messages
    getContactMessages: async () => {
      return await ContactMessage.find().sort({ createdAt: -1 });
    },

    // Single message
    getContactMessageById: async (_, { messageId }) => {
      return await ContactMessage.findById(messageId);
    },
  },

  Mutation: {
    //Sign-Up USer
    signupUser: async (_, { userNew }) => {
      const { fullname, email, password } = userNew;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User already exists with this email");
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
      if (!passwordRegex.test(password)) {
        throw new Error(
          "Password must contain 1 uppercase, 1 lowercase, 1 number & 1 special character"
        );
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
        fullname,
        email,
        password: hashedPassword,
        role: "customer",
      });

      await newUser.save();

      return newUser;
    },

    // Sign-In User
    signinUser: async (_, { userSignin }) => {
      const user = await User.findOne({ email: userSignin.email });
      if (!user) {
        throw new Error("Please SignUp First with This Email");
      }

      const doMatch = await bcrypt.compare(userSignin.password, user.password);
      if (!doMatch) {
        throw new Error("Invalid Email And Password");
      }

      const token = jwt.sign(
        {
          userId: user._id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return {
        token,
        role: user.role,
      };
    },

    // Logout User
    logoutUser: async (_parent, _args, context) => {
      try {
        if (context.res?.clearCookie) {
          context.res.clearCookie("token");
        }

        return {
          success: true,
          message: "Logged out successfully",
        };
      } catch (err) {
        return {
          success: false,
          message: "Failed to logout",
        };
      }
    },

    // Update User Role
    updateUserRole: async (_, { userId, role }) => {
      if (!["admin", "customer"].includes(role)) {
        throw new Error("Invalid role");
      }
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true }
      );
      if (!updatedUser) {
        throw new Error("User not found");
      }
      return updatedUser;
    },

    // Delete User
    deleteUser: async (_, { userId }) => {
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        throw new Error("User not found");
      }
      return "User deleted successfully";
    },

    // Add Product
    addProduct: async (_, { productNew }) => {
      try {
        const id = randomBytes(5).toString("hex");
        const processedData = {
          ...productNew,
          images: {
            thumbnail: productNew.images?.thumbnail || null,
            detailImage: productNew.images?.detailImage || null,
            gallery: productNew.images?.gallery || [],
          },
          specifications: {
            capacity: productNew.specifications?.capacity || null,
            material: productNew.specifications?.material || null,
            color: productNew.specifications?.color || null,
            weight: productNew.specifications?.weight || null,
          },
        };

        const newProduct = new Product({
          id,
          ...processedData,
        });

        await newProduct.save();
        console.log("Product saved successfully:", newProduct);
        return newProduct;
      } catch (error) {
        console.error("Error in addProduct resolver:", error);
        throw new Error(`Failed to add product: ${error.message}`);
      }
    },

    //Update Product
    updateProduct: async (_, { productId, productUpdate }) => {
      try {
        console.log("Updating product ID:", productId);

        // Try to find product by _id (ObjectId) or custom id field
        let existingProduct;

        // Check if productId looks like a MongoDB ObjectId (24 hex chars)
        if (/^[0-9a-fA-F]{24}$/.test(productId)) {
          existingProduct = await Product.findOne({ _id: productId });
        }

        // If not found by _id, try by custom id field
        if (!existingProduct) {
          existingProduct = await Product.findOne({ id: productId });
        }

        if (!existingProduct) {
          throw new Error(`Product with ID ${productId} not found`);
        }

        console.log("Found product to update:", existingProduct._id);

        // Process update data (similar to addProduct)
        const updateData = {
          name: productUpdate.name || existingProduct.name,
          category: productUpdate.category || existingProduct.category,
          price:
            productUpdate.price !== undefined
              ? productUpdate.price
              : existingProduct.price,
          rating:
            productUpdate.rating !== undefined
              ? productUpdate.rating
              : existingProduct.rating,
          description:
            productUpdate.description !== undefined
              ? productUpdate.description
              : existingProduct.description,
          shortDescription:
            productUpdate.shortDescription !== undefined
              ? productUpdate.shortDescription
              : existingProduct.shortDescription,
          availability:
            productUpdate.availability ||
            existingProduct.availability ||
            "In Stock",
        };

        // Handle images
        if (productUpdate.images || existingProduct.images) {
          updateData.images = {
            thumbnail:
              productUpdate.images?.thumbnail ||
              existingProduct.images?.thumbnail ||
              null,
            detailImage:
              productUpdate.images?.detailImage ||
              existingProduct.images?.detailImage ||
              null,
            gallery:
              productUpdate.images?.gallery ||
              existingProduct.images?.gallery ||
              [],
          };
        }

        // Handle specifications
        if (productUpdate.specifications || existingProduct.specifications) {
          updateData.specifications = {
            capacity:
              productUpdate.specifications?.capacity ||
              existingProduct.specifications?.capacity ||
              null,
            material:
              productUpdate.specifications?.material ||
              existingProduct.specifications?.material ||
              null,
            color:
              productUpdate.specifications?.color ||
              existingProduct.specifications?.color ||
              null,
            weight:
              productUpdate.specifications?.weight ||
              existingProduct.specifications?.weight ||
              null,
          };
        }

        // Update the product - Use findOneAndUpdate for both _id and custom id
        let updatedProduct;
        if (/^[0-9a-fA-F]{24}$/.test(productId)) {
          updatedProduct = await Product.findOneAndUpdate(
            { _id: productId },
            { $set: updateData },
            { new: true, runValidators: true }
          );
        } else {
          updatedProduct = await Product.findOneAndUpdate(
            { id: productId },
            { $set: updateData },
            { new: true, runValidators: true }
          );
        }

        if (!updatedProduct) {
          throw new Error("Failed to update product");
        }

        console.log("Product updated successfully:", updatedProduct);
        return updatedProduct;
      } catch (error) {
        console.error("Update product error:", error);
        throw new Error(`Failed to update product: ${error.message}`);
      }
    },

    // Delete Product
    deleteProduct: async (_, { productId }) => {
      try {
        console.log("Deleting product ID:", productId);

        let result;

        if (/^[0-9a-fA-F]{24}$/.test(productId)) {
          result = await Product.findOneAndDelete({ _id: productId });
        } else {
          result = await Product.findOneAndDelete({ id: productId });
        }

        if (!result) {
          throw new Error(`Product with ID ${productId} not found`);
        }

        console.log("Product deleted successfully:", productId);
        return "Product deleted successfully";
      } catch (error) {
        console.error("Delete product error:", error);
        throw new Error(`Failed to delete product: ${error.message}`);
      }
    },

    // Add to Cart
    addToCart: async (_, { userId, cartId, item }) => {
      let cart = await Cart.findOne(userId ? { userId } : { cartId });

      if (!cart) {
        cart = new Cart({
          userId: userId || null,
          cartId: cartId || null,
          cartItems: [],
        });
      }

      const existingItem = cart.cartItems.find(
        (i) => i.productId.toString() === item.productId
      );

      if (existingItem) {
        existingItem.quantity += item.quantity || 1;
      } else {
        cart.cartItems.push({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          images: { thumbnail: item.thumbnail },
        });
      }

      await cart.save();
      return cart;
    },

    // UPDATE QUANTITY
    updateCartItem: async (_, { userId, cartId, productId, quantity }) => {
      const cart = await Cart.findOne(userId ? { userId } : { cartId });

      if (!cart) throw new Error("Cart not found");

      const item = cart.cartItems.find(
        (i) => i.productId.toString() === productId
      );

      if (!item) throw new Error("Item not found");

      item.quantity = quantity;
      await cart.save;

      return cart;
    },

    // REMOVE ITEM
    removeCartItem: async (_, { userId, cartId, productId }) => {
      const cart = await Cart.findOne(userId ? { userId } : { cartId });

      if (!cart) throw new Error("Cart not found");

      cart.cartItems = cart.cartItems.filter(
        (i) => i.productId.toString() !== productId
      );

      await cart.save();
      return cart;
    },

    // CLEAR CART
    clearCart: async (_, { userId, cartId }, context) => {
      let query = null;
      if (userId) query = { userId };
      else if (cartId) query = { cartId };
      else if (context.user?.userId) query = { userId: context.user.userId };
      else throw new Error("Authentication required or provide cartId/userId");

      const cart = await Cart.findOne(query);
      if (!cart) throw new Error("Cart not found");

      cart.cartItems = [];
      await cart.save();

      return { success: true, message: "Cart cleared" };
    },

    // Create Order
    createOrder: async (_, { items, totalPrice, shippingDetails }, context) => {
      console.log("CONTEXT USER:", context.user);
      if (!context.user) {
        throw new Error("Authentication required");
      }

      const order = new Order({
        userId: context.user.id || context.user._id,
        items,
        totalPrice,
        shippingDetails,
      });

      await order.save();
      return order;
    },

    // Update Order Status (Admin)
    updateOrderStatus: async (_, { orderId, status }) => {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );

      if (!order) {
        throw new Error("Order not found");
      }

      return order;
    },

    // Delete Order
    deleteOrder: async (_, { orderId }) => {
      const order = await Order.findByIdAndDelete(orderId);
      if (!order) {
        throw new Error("Order not found");
      }
      return "Order deleted successfully";
    },

    // Add Contact Message
    addContactMessage: async (_, { contactInput }) => {
      const newMessage = new ContactMessage({
        fullName: contactInput.fullName,
        email: contactInput.email,
        subject: contactInput.subject,
        message: contactInput.message,
        createdBy: contactInput.createdBy || null,
      });

      await newMessage.save();
      return newMessage;
    },

    // Delete Message (Admin)
    deleteContactMessage: async (_, { messageId }) => {
      const deleted = await ContactMessage.findByIdAndDelete(messageId);
      if (!deleted) {
        throw new Error("Message not found");
      }
      return "Contact message deleted successfully";
    },
  },
};

export default resolvers;
