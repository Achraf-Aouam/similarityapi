"use client";
import { FC, useState } from "react";
import { Button } from "./ui/Button";
import { signOut } from "next-auth/react";
import { toast } from "./ui/Toast";

interface SignOutButtonProps {}

const SignOutButton: FC<SignOutButtonProps> = ({}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signuserout = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      toast({
        title: "error signing out",
        message: "Please Try again",
        type: "error",
      });
    }
  };

  return (
    <Button onClick={signuserout} isLoading={isLoading}>
      Sign Out
    </Button>
  );
};

export default SignOutButton;
