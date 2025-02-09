import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDB } from "@/lib/mongodb";
import { Account } from "@/models/Account";

export async function POST(req: Request) {
  await connectToDB();
  const session = await getServerSession();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { month, startingBalance, salary, emi, expenses, savings } =
    await req.json();

  const totalSaved = savings;
  const closingBalance = startingBalance + salary - emi - expenses - savings;

  try {
    const newAccountEntry = new Account({
      userId: session.user.id, // Associate with logged-in user
      month,
      startingBalance,
      salary,
      emi,
      expenses,
      savings,
      totalSaved,
      closingBalance,
    });

    await newAccountEntry.save();
    return NextResponse.json(
      { message: "Entry saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save entry" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  await connectToDB();
  const session = await getServerSession();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const entries = await Account.find({ userId: session.user.id });
    return NextResponse.json(entries, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 }
    );
  }
}
