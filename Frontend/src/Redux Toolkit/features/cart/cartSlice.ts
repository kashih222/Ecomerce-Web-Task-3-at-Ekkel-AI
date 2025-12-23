import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import type { RootState } from "../../types";
import client from "../../../GraphqlOprations/apolloClient";
import { GET_CART } from "../../../GraphqlOprations/queries";
import { REMOVE_CART_ITEM, CLEAR_CART, ADD_TO_CART_ITEMS, UPDATE_CART_ITEM } from "../../../GraphqlOprations/mutation";

// ================= TYPES =================
export type CartItem = {
  _id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  thumbnail: string;
};

export type Product = {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  images: { thumbnail: string };
};

type CartState = {
  items: CartItem[];
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
};

// ================= HELPERS =================
const getCartId = () => {
  let cartId = localStorage.getItem("guestCartId");
  if (!cartId) {
    cartId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("guestCartId", cartId);
  }
  return cartId;
};

const getUserId = () => localStorage.getItem("userId");

// ================= FETCH CART =================
export const fetchCart = createAsyncThunk<CartItem[], void, { rejectValue: string }>(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: GET_CART,
        variables: {
          userId: getUserId(),
          cartId: getCartId(),
        },
        fetchPolicy: "no-cache",
      });
      return data?.getCart?.cartItems || [];
    } catch (err) {
      console.error(err);
      return rejectWithValue("Could not load cart");
    }
  }
);

// ================= ADD TO CART =================
export const addToCart = createAsyncThunk<
  CartItem[],
  { product: Product; quantity?: number },
  { rejectValue: string }
>("cart/add", async ({ product, quantity = 1 }, { rejectWithValue }) => {
  try {
    const { data } = await client.mutate({
  mutation: ADD_TO_CART_ITEMS,
  variables: {
    userId: getUserId(),
    cartId: getCartId(),
    item: {
      productId: product._id || product.id,
      name: product.name,
      price: product.price,
      quantity,
      thumbnail: product.images?.thumbnail,
    },
  },
});

    toast.success("Added to cart");
    return data?.addToCart?.cartItems || [];
  } catch (err) {
    console.error(err);
    toast.error("Failed to add to cart");
    return rejectWithValue("Failed to add");
  }
});



// ================= UPDATE QUANTITY =================
export const updateQuantity = createAsyncThunk<
  CartItem[],
  { productId: string; action: "inc" | "dec" },
  { state: RootState; rejectValue: string }
>("cart/updateQty", async ({ productId, action }, { getState, rejectWithValue }) => {
  try {
    const item = (getState() as RootState).cart.items.find((i) => i.productId === productId);
    if (!item) return rejectWithValue("Item not found");

    const newQty = action === "inc" ? item.quantity + 1 : item.quantity - 1;
    if (newQty < 1) return rejectWithValue("Invalid quantity");

   const { data } = await client.mutate({
  mutation: UPDATE_CART_ITEM,
  variables: {
    userId: getUserId(),
    cartId: getCartId(),
    productId,
    quantity: newQty,
  },
});

    return data?.updateCartItem?.cartItems || [];
  } catch (err) {
    console.error(err);
    toast.error("Failed to update quantity");
    return rejectWithValue("Update failed");
  }
});


// ================= REMOVE ITEM =================
export const removeItem = createAsyncThunk<
  CartItem[],
  { productId: string },
  { rejectValue: string }
>("cart/remove", async ({ productId }, { rejectWithValue }) => {
  try {
    const { data } = await client.mutate({
      mutation: REMOVE_CART_ITEM,
      variables: {
        userId: getUserId(),
        cartId: getCartId(),
        productId,
      },
    });

    toast.success("Removed from cart");
    return data?.removeCartItem?.cartItems || [];
  } catch (err) {
    console.error(err);
    toast.error("Remove failed");
    return rejectWithValue("Remove failed");
  }
});


// ================= CLEAR CART =================
export const clearCart = createAsyncThunk<boolean, void, { rejectValue: string }>(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      await client.mutate({
        mutation: CLEAR_CART,
        variables: {
          userId: getUserId(),
          cartId: getCartId(),
        },
      });
      toast.success("Cart cleared");
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Clear cart failed");
      return rejectWithValue("Clear failed");
    }
  }
);
// ================= SLICE =================
const initialState: CartState = {
  items: [],
  status: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "success";
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || "Error loading cart";
      })
      // ADD
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // REMOVE
      .addCase(removeItem.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // CLEAR
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      })
      // UPDATE QUANTITY
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.error = action.payload || "Error updating cart";
      });
  },
});

export const selectCartItems = (state: RootState) => state.cart.items;

export default cartSlice.reducer;
