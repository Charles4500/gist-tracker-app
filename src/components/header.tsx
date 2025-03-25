"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LogIn,
  UserPlus,
  User,
  FileText,
  LogOut,
  PlusCircle,
  Home,
  Loader,
  Menu,
  X,
  Search,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { Input } from "./ui/input";
import { toast } from "sonner";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    //Close mobile menu when location changes
    setMobileMenuOpen(false);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [router.push]);

  if (status === "loading") {
    return <Loader className="animate-spin size-6 mr-4 mt-4 float-right " />;
  }

  const avatarFallback = session?.user?.name?.charAt(0).toUpperCase();
  const handleSignOut = async () => {
    await signOut({
      redirect: false,
    });
    router.push("/sign-in");
    toast.success('Logout success')
  };
  return (
    <SessionProvider session={session}>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and main nav */}
            <div className="flex items-center">
              <Link
                href="/"
                className="text-xl font-semibold text-primary flex items-center gap-2 hover-lift"
              >
                <FileText className="h-6 w-6" />
                <span className="hidden sm:inline">CodeGist</span>
              </Link>

              <nav className="hidden md:ml-10 md:flex items-center space-x-8">
                <Link
                  href="/"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === "/"
                      ? "text-primary"
                      : "text-foreground/80"
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/gists"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname.startsWith("/gists")
                      ? "text-primary"
                      : "text-foreground/80"
                  }`}
                >
                  Explore
                </Link>
                {session && (
                  <Link
                    href="/my-gists"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      location.pathname === "/my-gists"
                        ? "text-primary"
                        : "text-foreground/80"
                    }`}
                  >
                    My Gists
                  </Link>
                )}
              </nav>
            </div>

            {/* Search bar - hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <form className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search gists..."
                    className="w-full pl-10 pr-4 rounded-full border-muted bg-background"
                    value={""}
                    onChange={() => {}}
                  />
                </div>
              </form>
            </div>

            {/* Right side - Auth buthrefns or user profile */}
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <Link href="/gists/creat-gists">
                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden sm:flex items-center space-x-2 hover-lift"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>New Gist</span>
                    </Button>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-9 w-9 p-0 hover-lift"
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={session.user?.image || undefined}
                            alt={session?.user?.name || ""}
                          />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {avatarFallback}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 animate-scale-in"
                    >
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href="/profile"
                          className="cursor-pointer flex w-full items-center"
                        >
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/my-gists"
                          className="cursor-pointer flex w-full items-center"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          <span>My Gists</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="cursor-pointer text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="hidden md:flex items-center space-x-4">
                  <Link href="/sign-in">
                    <Button variant="ghost" size="sm" className="hover-lift">
                      <LogIn className="mr-2 h-4 w-4" />
                      Log in
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button size="sm" className="hover-lift">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign up
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile menu buthrefn */}
              <div className="-mr-2 flex md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="inline-flex items-center justify-center"
                >
                  <span className="sr-only">Open main menu</span>
                  {mobileMenuOpen ? (
                    <X className="block h-6 w-6" />
                  ) : (
                    <Menu className="block h-6 w-6" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen
              ? "max-h-screen opacity-100 animate-fade-in"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 glass">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10"
            >
              <Home className="inline-block mr-2 h-5 w-5" />
              Home
            </Link>
            <Link
              href="/gists"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10"
            >
              <FileText className="inline-block mr-2 h-5 w-5" />
              Explore
            </Link>

            {session ? (
              <>
                <Link
                  href="/my-gists"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10"
                >
                  <User className="inline-block mr-2 h-5 w-5" />
                  My Gists
                </Link>
                <Link
                  href="/new-gist"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10"
                >
                  <PlusCircle className="inline-block mr-2 h-5 w-5" />
                  New Gist
                </Link>
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10"
                >
                  <User className="inline-block mr-2 h-5 w-5" />
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="inline-block mr-2 h-5 w-5" />
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10"
                >
                  <LogIn className="inline-block mr-2 h-5 w-5" />
                  Log in
                </Link>
                <Link
                  href="/sign-up"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10"
                >
                  <UserPlus className="inline-block mr-2 h-5 w-5" />
                  Sign up
                </Link>
              </>
            )}

            {/* Mobile search */}
            <div className="px-3 py-2">
              <form className="mt-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search gists..."
                    className="w-full pl-10 pr-4"
                    value={""}
                    onChange={() => {}}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </header>
    </SessionProvider>
  );
};
