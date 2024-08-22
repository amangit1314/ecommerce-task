import { NextResponse } from "next/server";
import { join } from "path";
import { promises as fs } from "fs";

export const GET = async (req: Request) => {
  try {
    // Define the path to the products.json file
    const filePath = join(process.cwd(), "public", "products.json");

    // Read the file
    const fileContents = await fs.readFile(filePath, "utf-8");

    // Parse the JSON data
    const products = JSON.parse(fileContents);

    // console.log("Products from json file: ", products);

    // Return the products in the response
    return NextResponse.json(
      {
        success: true,
        data: products,
        message: "Products fetched successfully ...",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(
      "Error fetching products from products.json file, ERROR: ",
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching products ...",
      },
      { status: 500 }
    );
  }
};
