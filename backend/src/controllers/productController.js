import { prisma } from "../../prisma/client.js";

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json({ success: true, products });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch products" });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, product });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch product" });
  }
};

export const createProduct = async (req, res) => {
  const { name, description, price, image_url, stock } = req.body;
  if (!name || !description || !price || !image_url || stock === undefined) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }
  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        image_url,
        stock: Number(stock),
      },
    });
    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ auccess: false, message: "Failed to create product" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url, stock } = req.body;
  const someFields = {};
  if (name !== undefined) someFields.name = name;
  if (description !== undefined) someFields.description = description;
  if (price !== undefined) someFields.price = Number(price);
  if (image_url !== undefined) someFields.image_url = image_url;
  if (stock !== undefined) someFields.stock = Number(stock);

  try {
    const product = await prisma.product.update({
      where: { id },
      data: { ...someFields },
    });
    return res.status(200).json({ success: true, product });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update product" });
  }
};
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({ where: { id } });
    res.status(200).json({ success: false, message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete product" });
  }
};
export const deleteAllProducts = async (req, res) => {
  try {
    await prisma.orderItem.deleteMany({});
    await prisma.product.deleteMany({});
    res.status(200).json({ success: true, message: "All products deleted" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete all products" });
  }
};
