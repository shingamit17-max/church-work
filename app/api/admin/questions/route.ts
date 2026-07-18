import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { CustomQuestion } from '@/models/CustomQuestion';

export async function GET() {
  try {
    await dbConnect();
    const questions = await CustomQuestion.find().sort({ order: 1 });
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await dbConnect();
    
    // Assign order to be at the end if not specified
    if (data.order === undefined) {
      const count = await CustomQuestion.countDocuments();
      data.order = count;
    }

    const question = await CustomQuestion.create(data);
    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}
