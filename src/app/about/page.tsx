import { SignOutButton, SignUpButton } from "@clerk/nextjs"

function page() {
  return (
    <div>
        <SignUpButton />
        <SignOutButton />
    </div>
  )
}

export default page