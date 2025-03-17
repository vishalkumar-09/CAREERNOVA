"use client"
import { useEffect } from 'react'
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import Image from 'next/image';
import { useRef } from 'react';
const HeroSection = () => {
    const imageRef=useRef(null);
    useEffect(()=>{
        const imagelement=imageRef.current;

        const handlescroll=()=>{
            const scrollPosition=window.scrollY;
            const scrollThreshold=100;

            if(scrollPosition>scrollThreshold){
                imagelement.classList.add("scrolled");
            }else{
                imagelement.classList.remove("scrolled");
            }
        };
        window.addEventListener("scroll",handlescroll);
        return ()=>window.removeEventListener("scroll",handlescroll);
    },[]);
  return (
    <section className="w-full pt-36 md:pt-48 pb-10">
        <div className="spcae-y-6 text-center">
            <div className="space-y-6 mx-auto">
                <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl x1:text-8xl gradient-title">
                    Your AI Career Coach for 
                    <br />
                    Professional Success
                </h1>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                    Advance your career with personalized guidance, interview prep, and 
                    AI-powered tools for job success.
                </p>
            </div >
            <div className="flex justify-center space-x-4">
                <br />
                <br />
                <Link href="/dashboard">
                    <Button size="lg" className="bg-white text-black px-8 hover:text-black">
                        Get Started
                        </Button>
                </Link>
                <Link href="">
                    <Button size="lg" className="px-8" variant="outline">
                        Get Started
                        </Button>
                </Link>
            </div>
            <div className="hero-image-wrapper mt:5 md:mt-0">
                <div ref={imageRef} className="hero-image">
                    <Image 
                    src={"/banner.jpeg"}
                    width={1280}
                    height={720}
                    alt="Banner CareerNova"
                    className="rounded-lg shadow-2xl border mx-auto "
                    priority/>
                </div>
            </div>
        </div>
    </section>
  )
}

export default HeroSection
