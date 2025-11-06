import { prisma } from "../../prisma/client.js";

export const getCart = async (req, res) => {
  const { sessionId } = req.query;
  try {
    let cart;

    if (sessionId) {
      cart = await prisma.cart.findUnique({
        where: { sessionId: String(sessionId) },
        include: { items: { include: { product: true } } },
      });

      if (!cart) return res.json({ success: true, cartItems: [], total: 0 });

      const total = cart.items.reduce(
        (sum, item) => sum + item.quantity * Number(item.product.price),
        0
      );
      return res.json({ success: true, cartItems: cart.items, total });
    }

    const carts = await prisma.cart.findMany({
      include: { items: { include: { product: true } } },
    });

    res.json({ success: true, carts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch cart" });
  }
};

export const addToCart = async (req, res) => {
  const { sessionId, productId, quantity } = req.body;

  if (!sessionId || !productId || !quantity) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    let cart = await prisma.cart.findUnique({ where: { sessionId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { sessionId } });
    }

    let item = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (item) {
      item = await prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity: item.quantity + Number(quantity) },
      });
    } else {
      item = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity: Number(quantity),
        },
      });
    }

    res.json({ success: true, message: "Item added", item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to add item" });
  }
};

export const updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity) {
    return res
      .status(400)
      .json({ success: false, message: "Quantity is required" });
  }

  try {
    const item = await prisma.cartItem.update({
      where: { id },
      data: { quantity: Number(quantity) },
    });
    res.json({ success: true, item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update item" });
  }
};

export const removeCartItem = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.cartItem.delete({ where: { id } });
    res.json({ success: true, message: "Item removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to remove item" });
  }
};
