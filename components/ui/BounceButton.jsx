import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const BounceButton = () => {
  return (
    <Link href="/dashboard" passHref legacyBehavior>
      <a className="bounce-button animate-bounce">
        Start Your Journey Today
        <ArrowRight className="ml-2 h-4 w-4" />
      </a>
    </Link>
  );
};

export default BounceButton;
