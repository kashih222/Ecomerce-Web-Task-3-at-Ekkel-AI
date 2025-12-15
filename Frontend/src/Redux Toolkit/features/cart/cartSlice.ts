import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import type {  RootState } from "../../types";


// TYPES
export type CartItem = {
  _id: string;
  productId: string;
  name: string;
  price: number;
  images: { thumbnail: string };
  quantity: number;
};

type CartState = {
  items: CartItem[];
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
};

// AUTH TOKEN
const getHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// FETCH CART
export const fetchCart = createAsyncThunk<CartItem[], void, { rejectValue: string }>(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/cart/get-cart",
        { headers: getHeaders() }
      );
      return res.data.cartItems || [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Could not load cart",);
      return rejectWithValue("Could not load cart");
    }
  }
);

//  ADD TO CART
export const addToCart = createAsyncThunk<
  CartItem[],
  { productId: string; quantity?: number },
  { rejectValue: string }
>("cart/add", async ({ productId, quantity = 1 }, { rejectWithValue }) => {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/cart/add-to-cart",
      { productId, quantity },
      { headers: getHeaders() }
    );
    toast.success("Added to cart");
    return res.data.cartItems || [];
  } catch {
    toast.error("Failed to add");
    return rejectWithValue("Failed to add");
  }
});

//  UPDATE QUANTITY
export const updateQuantity = createAsyncThunk<
  CartItem[],
  { productId: string; action: "inc" | "dec" },
  { state: RootState; rejectValue: string }
>("cart/updateQty", async ({ productId, action }, { getState, rejectWithValue }) => {
  try {
    const item = getState().cart.items.find((i) => i.productId === productId);
    if (!item) return rejectWithValue("Not found");

    const newQty = action === "inc" ? item.quantity + 1 : item.quantity - 1;
    if (newQty < 1) return rejectWithValue("Invalid quantity");

    const res = await axios.post(
      "http://localhost:5000/api/cart/update-qty",
      { productId, quantity: newQty },
      { headers: getHeaders() }
    );

    return res.data.cartItems || [];
  } catch {
    toast.error("Update failed");
    return rejectWithValue("Update failed");
  }
});

//  REMOVE ITEM
export const removeItem = createAsyncThunk<
  CartItem[],
  { productId: string },
  { rejectValue: string }
>("cart/remove", async ({ productId }, { rejectWithValue }) => {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/cart/remove-item",
      { productId },
      { headers: getHeaders() }
    );
    toast.success("Removed");
    return res.data.cartItems || [];
  } catch {
    toast.error("Remove failed");
    return rejectWithValue("Remove failed");
  }
});


// SLICE

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
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload || "Error adding";
      })

      // UPDATE QTY
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.error = action.payload || "Error updating";
      })

      // REMOVE
      .addCase(removeItem.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeItem.rejected, (state, action) => {
        state.error = action.payload || "Error removing";
      });
  },
});


export const selectCartItems = (state: RootState) => state.cart.items;

export default cartSlice.reducer;
