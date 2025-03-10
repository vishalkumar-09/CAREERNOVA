import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { ChevronDown, FileText, GraduationCapIcon, LayoutDashboard, PenBox, StarsIcon } from 'lucide-react';
import { 
    DropdownMenu, 
    DropdownMenuTrigger, 
    DropdownMenuContent,
    DropdownMenuItem 
  } from "@/components/ui/dropdown-menu";
  
import {SignedOut, SignedIn, SignInButton, UserButton} from "@clerk/nextjs";
const Header = () => {
  return (
    <header className="fixed top-0 w-full border-black bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" >
                <Image src="/logo.png" alt="CareerNova Logo" width={200} height={60}
                className="h-12 py-1 w-auto object-contain"/>
            </Link>
            <div className="flex items-center space-x-2 md:space-x-4">
                <SignedIn>
                    <Link href="/dashboard">   
                        <Button variant="outline">
                            <LayoutDashboard className="h-4 w-4"/>
                            <span className="hidden md:block">Industry Insights</span>
                            
                        </Button>
                    </Link>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="bg-white text-black">
                            <StarsIcon className="h-4 w-4"/>
                            <span className="hidden md:block">Growth Tools</span>
                            <ChevronDown className="h-4 w-4"/>
                    </Button></DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white text-black">
                    <DropdownMenuItem>
                        <Link href={'/resume'} className="flex items-center gap-2">
                        <FileText className="h-4 w-4"/>
                        <span>Build Resume</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href={'/ai-cover-letter'} className="flex items-center gap-2">
                        <PenBox className="h-4 w-4"/>
                        <span>Cover Letter</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href={'/interview'} className="flex items-center gap-2">
                        <GraduationCapIcon className="h-4 w-4"/>
                        <span>Interview Prep</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
                    <UserButton 
                        appearance={{
                            elements:{
                                avatarBox:"w-10 h-10",
                                UserButtonPopoverCard: "shadow-xl",
                                userPreviewMainIdentifier: "front-semibold",
                            },
                        }}
                        afterSignOutUrl="/"
                    />
                </SignedIn>
                <SignedOut>
                    <SignInButton redirecturl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}>
                        <Button variant="outline">Sign In</Button>
                    </SignInButton>
                </SignedOut>
            </div>
        </nav>
    </header>
  )
}

export default Header
