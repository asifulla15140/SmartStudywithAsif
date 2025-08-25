'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Library, Settings } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { LogoIcon } from '@/components/icons';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Create Lesson', icon: Home },
    { href: '/my-library', label: 'My Library', icon: Library },
  ];

  const bottomNavItems = [
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  const pageTitle = [...navItems, ...bottomNavItems].find(item => item.href === pathname)?.label || 'Create Lesson'

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen w-full bg-muted/40">
        <Sidebar>
          <div className="flex h-full flex-col">
            <SidebarHeader className="border-b">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                  <LogoIcon className="h-6 w-6 text-primary" />
                  <span className="font-headline text-lg">SmartStudy with Asif</span>
              </Link>
            </SidebarHeader>
            <SidebarContent className="p-2">
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <Link href={item.href} passHref legacyBehavior>
                      <SidebarMenuButton asChild isActive={pathname === item.href}>
                        <a>
                          <item.icon />
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="mt-auto p-2">
               <Separator className="mb-2" />
               <SidebarMenu>
                {bottomNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <Link href={item.href} passHref legacyBehavior>
                        <SidebarMenuButton asChild isActive={pathname === item.href}>
                          <a>
                            <item.icon />
                            <span>{item.label}</span>
                          </a>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
               </SidebarMenu>
            </SidebarFooter>
          </div>
        </Sidebar>
        <SidebarInset className="flex flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger className="sm:hidden" />
            <div className="flex-1">
              <h1 className="font-headline text-2xl font-semibold">{pageTitle}</h1>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
