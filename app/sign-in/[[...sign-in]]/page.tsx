import { SignIn, Show } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-textPrimary p-4">
      <Show when="signed-out">
        <SignIn />
      </Show>
    </div>
  );
}
