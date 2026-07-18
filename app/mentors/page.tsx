import { redirect } from 'next/navigation';

export default function MentorsIndexPage() {
  redirect('/dashboard/mentee/mentors');
}
