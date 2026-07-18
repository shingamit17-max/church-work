import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { JobOpportunity } from '@/models/JobOpportunity';

export async function GET() {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'mentor') {
    return NextResponse.json({ error: 'Unauthorized. Only mentors can view their posted jobs.' }, { status: 403 });
  }

  try {
    await dbConnect();
    
    // Fetch jobs posted by the currently logged-in mentor
    const jobs = await JobOpportunity.find({ postedBy: session.user.id })
      .sort({ createdAt: -1 });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching mentor jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
