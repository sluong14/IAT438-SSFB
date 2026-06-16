// Specific stage landing: /stage
// Shows STAGE A overview — same home-page layout with stage name at bottom
// Reached from the NavStrip chip or direct nav
import { redirect } from 'next/navigation';

// Default to stage-a as the entry point
export default function StagePage() {
  redirect('/stage/stage-a');
}
