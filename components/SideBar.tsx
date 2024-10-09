"use client";
import React, { useState } from "react";
import { usePathname } from 'next/navigation';
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  // IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
// import { cn } from "@/lib/utils";

export function SideBar() {
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconBrandTabler className=" h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "submissions",
      href: "/submissions",
      icon: <IconUserBolt className=" h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Create Form",
      href: "/createform",
      icon: <IconSettings className=" h-5 w-5 flex-shrink-0" />,
    },
    // {
    //   label: "Logout",
    //   href: "#",
    //   icon: <IconArrowLeft className=" h-5 w-5 flex-shrink-0" />,
    // },
  ];
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink 
                  key={idx} 
                  link={link} 
                  className={`${
                    pathname === link.href
                      ? "bg-secondary px-1 rounded-lg"
                      : "bg-transparent px-1  rounded-lg"
                  }`} 
                  // Remove the isActive prop if not needed, or
                  // Update the component's props interface to include isActive: boolean
                />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "21bubbles",
                href: "#",
                icon: (
                  <Image
                    src="/21bubbles_logo.jpeg"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center  py-1 relative z-20"
    >
      <div className="h-5 w-6 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium  whitespace-pre"
      >
        FEED LOOP
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="/dashboard"
      className="font-normal flex space-x-2 items-center py-1 relative z-20"
    >
      <div className="h-5 w-6  rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

// Dummy dashboard component with content
