import { prisma } from "../../prisma/client.js";
import { v4 as uuidv4 } from "uuid";

export const checkout = async (req, res) => {
  const { sessionId, name, email } = req.body;

  if (!sessionId || !name || !email) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const total = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    const receipt = {
      orderId: uuidv4(),
      customerName: name,
      customerEmail: email,
      items: cart.items.map((item) => ({
        quantity: item.quantity,
        product: {
          name: item.product.name,
          price: item.product.price,
        },
      })),
      total,
      timestamp: new Date(),
      message: "Order completed successfully!",
    };

    await prisma.order.create({
      data: {
        orderId: receipt.orderId,
        customerName: name,
        customerEmail: email,
        total,
        items: {
          create: cart.items.map((item) => ({
            quantity: item.quantity,
            price: item.product.price,
            product: {
              create: {
                name: item.product.name,
                description: item.product.description,
                price: item.product.price,
                image_url: item.product.image_url,
                stock: item.product.stock,
              },
            },
          })),
        },
      },
    });

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    res.json({ success: true, receipt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Checkout failed" });
  }
};
