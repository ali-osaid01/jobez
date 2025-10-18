"use client";

import { useState } from "react";
import { Settings, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-border bg-white">
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        {/* 🔹 Left: Logo */}
        <div className="flex items-center space-x-2">
          <Image
            src="/logo/jobez.png"
            alt="JobEZ Logo"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            JobEZ
          </h1>
        </div>

        {/* 🔹 Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/jobs"
            className="text-gray-800 hover:text-blue-600 transition-colors font-medium"
          >
            Jobs
          </Link>
          <Link
            href="/companies"
            className="text-gray-800 hover:text-blue-600 transition-colors font-medium"
          >
            Companies
          </Link>
        </div>

        {/* 🔹 Right Side: Avatar + Hamburger */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Avatar Dropdown (always visible) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full p-0"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/avatar.jpeg" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
              <div className="flex items-center gap-2 px-2 py-1.5 border-b">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar.jpeg" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Syed Ahmed</p>
                  <p className="text-xs text-gray-500">syedahmedkhalid@gmail.com</p>
                </div>
              </div>

              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button className="text-red-600 hover:text-red-700 w-full text-left">
                  Logout
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 🔹 Mobile Menu (Dropdown) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3">
          <div className="flex flex-col gap-3">
            <Link
              href="/jobs"
              className="text-gray-700 hover:text-blue-600 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Jobs
            </Link>
            <Link
              href="/companies"
              className="text-gray-700 hover:text-blue-600 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Companies
            </Link>
            <Link
              href="/profile"
              className="text-gray-700 hover:text-blue-600 font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
