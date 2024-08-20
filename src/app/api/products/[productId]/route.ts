import { NextResponse } from "next/server";
import { join } from "path";
import { promises as fs } from "fs";

export const GET = async (
  req: Request,
  { params }: { params: { productId: string } }
) => {
  try {
    const productId = params?.productId!;

    // Define the path to the products.json file
    const filePath = join(process.cwd(), "public", "products.json");

    // Read the file
    const fileContents = await fs.readFile(filePath, "utf-8");

    // Parse the JSON data
    const products = JSON.parse(fileContents);

    console.log("Products from json file: ", products);

    // Find the product with the given productId
    const product = products.find((p: any) => p.id === productId);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    // Return the specific product in the response
    return NextResponse.json(
      {
        success: true,
        data: product,
        message: "Product fetched successfully ...",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(
      "Error fetching product from products.json file, ERROR: ",
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching product ...",
      },
      { status: 500 }
    );
  }
};
