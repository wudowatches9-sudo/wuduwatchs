'use client'

import { useState } from 'react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/Sheet";
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { href: '/story', label: 'Our Story' },
    { href: '/contact', label: 'Contact Us' },
];

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:bg-transparent hover:text-current">
                    <Menu />
                    <span className="sr-only">Open menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent position="left" className="w-72 bg-background text-soft-white font-heading p-0">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="font-bold text-lg">Menu</h2>
                    <SheetClose asChild>
                        <Button variant="ghost" size="icon">
                            <span className="sr-only">Close menu</span>
                        </Button>
                    </SheetClose>
                </div>
                <nav className="flex flex-col p-4 space-y-2">
                    {navLinks.map(({ href, label }) => (
                        <SheetClose asChild key={href}>
                            <Link
                                href={href}
                                className="px-4 py-2 rounded-md text-lg font-medium transition-colors text-soft-white"
                            >
                                {label}
                            </Link>
                        </SheetClose>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    );
}
