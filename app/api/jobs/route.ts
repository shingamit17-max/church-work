import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { JobOpportunity } from '@/models/JobOpportunity';

export async function GET() {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    
    // Fetch active jobs, populated with the mentor who posted them
    const jobs = await JobOpportunity.find({ isActive: true })
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'mentor') {
    return NextResponse.json({ error: 'Unauthorized. Only mentors can post jobs.' }, { status: 403 });
  }

  try {
    await dbConnect();
    
    const data = await req.json();
    
    const newJob = new JobOpportunity({
      title: data.title,
      company: data.company,
      description: data.description,
      location: data.location,
      type: data.type || 'Full-time',
      salary: data.salary,
      skills: data.skills || [],
      postedBy: session.user.id,
    });

    await newJob.save();

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job posting' }, { status: 500 });
  }
}
