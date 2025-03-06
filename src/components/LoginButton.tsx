import { SignInButton } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

function LoginButton() {
  return (
    <SignInButton mode="modal">
      <Button 
        variant="default" 
        size="sm"
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/20"
      >
        <LogIn className="w-4 h-4 mr-2" />
        Sign In
      </Button>
    </SignInButton>
  );
}

export default LoginButton;