"use client"

import Link from "next/link"
import { useState } from "react"
import {  Bell,  MessageCircle,  Search,  Briefcase,  Building2,  Zap,  Menu,  X,Settings,LogOut,} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-4">
          <span className="font-black text-xl">JOBEZ</span>
        </Link>

        {/* Desktop  */}
        <div className="hidden ml-3 md:flex items-center gap-3">
          <NavIcon href="/jobs" title="Jobs"><Briefcase size={20} /></NavIcon>
          <NavIcon href="/companies" title="Companies"><Building2 size={20} /></NavIcon>
          <NavIcon href="/ai-interviews" title="AI Interviews"><Zap size={20} /></NavIcon>
        </div>

        {/* Search */}
        <div className="hidden sm:flex flex-1 mx-8">
          <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 w-full">
            <Search size={18} className="text-muted-foreground" />
            <input
              placeholder="Search jobs, companies..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            <IconButton><Bell size={20} /></IconButton>
            <IconButton><MessageCircle size={20} /></IconButton>
          </div>

          {/* Profile Avatar (Desktop) */}
          <div className="relative hidden md:block">
            <button
              aria-label="Open profile menu"
              onClick={() => setIsProfileOpen((prev) => !prev)}
            >
              <Avatar className="h-9 w-9 cursor-pointer">
                <AvatarImage src="/avatar.jpg" alt="Syed Ahmed" />
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border rounded-lg shadow-lg py-2">
                <DropdownItem href="/profile">Profile</DropdownItem>
                <DropdownItem href="/settings">Settings</DropdownItem>
                <button className="w-full text-left px-4 py-2 hover:bg-muted flex items-center gap-2">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Hamburger menu */}
          <button
            aria-label="Toggle mobile menu"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out
        ${isMobileMenuOpen ? "max-h-[500px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"}`}
      >
        <div className="px-4 py-4 space-y-3 border-t">
          <MobileLink href="/jobs" icon={<Briefcase size={18}  />}>Jobs</MobileLink>
          <MobileLink href="/companies" icon={<Building2 size={18} />}>Companies</MobileLink>
          <MobileLink href="/ai-interviews" icon={<Zap size={18} />}>AI Interviews</MobileLink>

          {/* Profile Section */}
          <div className="pt-3 border-t space-y-2">
            <MobileLink
              href="/profile"
              icon={
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/avatar.jpg" />
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
              }
            >
              Profile
            </MobileLink>

            <MobileLink href="/settings" icon={<Settings size={18} />}>
              Settings
            </MobileLink>

            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition text-sm font-medium">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}



function NavIcon({ href, title, children }: any) {
  return (
    <Link href={href} title={title} className="p-2 rounded-lg hover:bg-muted hover:text-primary transition">
      {children}
    </Link>
  )
}

function IconButton({ children }: any) {
  return (
    <button className="p-2 rounded-lg hover:bg-muted hover:text-primary transition">
      {children}
    </button>
  )
}

function DropdownItem({ href, children }: any) {
  return (
    <Link href={href} className="block px-4 py-2 hover:bg-muted">
      {children}
    </Link>
  )
}

function MobileLink({ href, icon, children }: any) {
  return (
    <Link href={href} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition">
      {icon}
      <span className="text-sm font-medium">{children}</span>
    </Link>
  )
}

export default Navbar
