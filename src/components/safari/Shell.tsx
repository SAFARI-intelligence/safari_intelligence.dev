import { Link, useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, Globe, LogIn, LogOut, Shield, Building2, User as UserIcon, Sun, Moon, ChevronDown, Wallet, BookMarked, Coins } from "lucide-react";
import { SafariIcon, type IconName } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MaasaiDivider } from "./MaasaiDivider";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/hooks/use-theme";
import lionLogo from "@/assets/safari-lion-logo.jpg";

const navLinks = [
  { to: "/", label: "Discover", sw: "Tazama" },
  { to: "/plan", label: "Plan a safari", sw: "Panga" },
  { to: "/wildlife", label: "Wildlife", sw: "Wanyama" },
  { to: "/hotels", label: "Stays", sw: "Malazi" },
] as const;
const drawerLinks = [
  { to: "/hotels", label: "Hotels & stays" }, { to: "/book", label: "Safari packages" },
  { to: "/stories", label: "Wildlife stories" }, { to: "/wis", label: "WIS · Sample experience" },
  { to: "/journal", label: "Safari journal" }, { to: "/map", label: "Map" },
  { to: "/about", label: "About SAFARI" },
] as const;
const footerLinks = [
  { to: "/plan", label: "Plan a safari" }, { to: "/hotels", label: "Places to stay" },
  { to: "/stories", label: "Wildlife stories" }, { to: "/wis", label: "Explore WIS" },
  { to: "/about", label: "Our story" },
] as const;
const mobileTabs: ReadonlyArray<{ to: "/" | "/plan" | "/wildlife" | "/book" | "/profile"; label: string; icon: IconName }> = [
  { to: "/", label: "Home", icon: "home" }, { to: "/plan", label: "Plan", icon: "ai" },
  { to: "/wildlife", label: "Wild", icon: "explore" }, { to: "/book", label: "Stay", icon: "tent" },
  { to: "/profile", label: "Me", icon: "profile" },
];

export function Shell({ children, fullBleed = false }: { children: React.ReactNode; fullBleed?: boolean }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const [lang, setLang] = useState<"EN" | "SW">("EN");
  const [points, setPoints] = useState(0);
  const location = useLocation();
  const { user, primaryRole, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  useEffect(() => {
    const read = () => {
      try { const stored = window.localStorage.getItem("simba_points"); setPoints(stored ? parseInt(stored, 10) || 0 : 6420); }
      catch { setPoints(0); }
    };
    read();
    const onStorage = (e: StorageEvent) => { if (e.key === "simba_points") read(); };
    window.addEventListener("storage", onStorage);
    const i = setInterval(read, 1500);
    return () => { window.removeEventListener("storage", onStorage); clearInterval(i); };
  }, []);
  useEffect(() => { setDrawerOpen(false); setAcctOpen(false); }, [location.pathname]);
  const profileTarget = primaryRole === "admin" ? "/support" : primaryRole === "operator" ? "/operator" : "/profile";
  const terminalLink = primaryRole === "admin" ? { to: "/support" as const, label: "Support", icon: Shield } : primaryRole === "operator" ? { to: "/partner" as const, label: "Partner", icon: Building2 } : null;

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="sr-only fixed left-4 top-4 z-[100] rounded-md bg-background px-4 py-3 text-foreground focus:not-sr-only">Skip to content</a>
      <header className="sticky top-0 z-50 border-b border-brand-nav-foreground/15 bg-brand-nav text-brand-nav-foreground">
        <nav aria-label="Primary navigation" className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-8 lg:px-12">
          <Link to="/" aria-label="SAFARI home" className="flex shrink-0 items-center gap-2.5">
            <img src={lionLogo} alt="" className="h-10 w-10 rounded-full object-cover ring-1 ring-scene-accent/30" />
            <div><p className="font-display text-xl font-semibold">SAFARI</p><p className="text-[10px] text-scene-muted">Kenya. Every world.</p></div>
          </Link>
          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => <li key={l.to}><Button asChild variant={location.pathname === l.to ? "safari" : "navigation"} className="px-3"><Link to={l.to} aria-current={location.pathname === l.to ? "page" : undefined}>{lang === "EN" ? l.label : l.sw}</Link></Button></li>)}
          </ul>
          <div className="flex items-center gap-1.5">
            <Button variant="navigation" size="icon" onClick={toggleTheme} className="hidden sm:inline-flex" aria-label={theme === "dark" ? "Use light theme" : "Use dark theme"} title={theme === "dark" ? "Use light theme" : "Use dark theme"}>{theme === "dark" ? <Sun /> : <Moon />}</Button>
            <Button variant="navigation" onClick={() => setLang(lang === "EN" ? "SW" : "EN")} className="hidden px-2 sm:inline-flex" aria-label="Switch navigation language" title="Switch navigation language"><Globe />{lang}</Button>
            {terminalLink && <Button asChild variant="navigation" className="hidden xl:inline-flex"><Link to={terminalLink.to}><terminalLink.icon />{terminalLink.label}</Link></Button>}
            {user && <Button asChild variant="navigation" className="hidden px-2 xl:inline-flex"><Link to="/simba" title={`${points.toLocaleString()} Simba Points`}><Coins />{points.toLocaleString()}<span className="text-xs text-scene-muted">pts</span></Link></Button>}
            {user ? <DropdownMenu open={acctOpen} onOpenChange={setAcctOpen}><DropdownMenuTrigger asChild><Button variant="safari" aria-label="My account"><UserIcon /><span className="hidden sm:inline">My account</span><ChevronDown /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-52"><DropdownMenuItem asChild><Link to="/wallet"><Wallet />Wallet</Link></DropdownMenuItem><DropdownMenuItem asChild><Link to="/pay/bookings"><BookMarked />My bookings</Link></DropdownMenuItem><DropdownMenuItem asChild><Link to="/journal"><BookMarked />Safari journal</Link></DropdownMenuItem><DropdownMenuItem asChild><Link to={profileTarget}><UserIcon />{primaryRole === "admin" ? "Support console" : primaryRole === "operator" ? "Operator portal" : "Profile"}</Link></DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem onSelect={() => { setAcctOpen(false); void signOut(); }}><LogOut />Sign out</DropdownMenuItem></DropdownMenuContent></DropdownMenu> : <Button asChild variant="safari" className="px-3"><Link to="/auth"><LogIn /><span>Sign in</span></Link></Button>}
            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}><SheetTrigger asChild><Button variant="navigation" size="icon" aria-label="Open menu" title="Open menu"><Menu /></Button></SheetTrigger><SheetContent aria-describedby={undefined} className="overflow-y-auto"><SheetTitle className="font-display text-2xl">Explore SAFARI</SheetTitle><nav aria-label="All pages" className="mt-6"><ul className="space-y-1">{[...navLinks, ...drawerLinks].filter((link, index, all) => all.findIndex((other) => other.to === link.to) === index).map((l) => <li key={l.to}><Button asChild variant="ghost" className="h-11 w-full justify-start"><Link to={l.to} aria-current={location.pathname === l.to ? "page" : undefined}>{l.label}</Link></Button></li>)}</ul><div className="mt-5 border-t border-border pt-5"><Button variant="outline" onClick={toggleTheme}>{theme === "dark" ? <Sun /> : <Moon />}{theme === "dark" ? "Light theme" : "Dark theme"}</Button></div></nav></SheetContent></Sheet>
          </div>
        </nav>
      </header>
      <main id="main-content" tabIndex={-1} className={fullBleed ? "flex-1" : "flex-1 px-3 py-6 pb-8 sm:px-6 sm:py-10"}>{children}</main>
      <footer className="safari-footer border-t border-border bg-background px-5 pt-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl"><MaasaiDivider className="mb-8" /><div className="flex flex-col justify-between gap-7 md:flex-row"><div><Link to="/" className="font-display text-3xl font-semibold">SAFARI</Link><p className="mt-2 text-sm text-muted-foreground">One Country. Every World.</p><p className="mt-2 text-xs text-muted-foreground">Built in Nairobi. Rooted in Kenya.</p></div><nav aria-label="Footer navigation"><ul className="flex flex-wrap gap-x-6 gap-y-4 text-sm">{footerLinks.map((l) => <li key={l.to}><Link to={l.to} className="text-muted-foreground hover:text-foreground">{l.label}</Link></li>)}</ul></nav></div><p className="mt-8 border-t border-border pt-5 text-xs italic leading-relaxed text-muted-foreground">“Haraka haraka haina baraka” — Hurry, hurry has no blessing.</p></div>
      </footer>
      <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden"><div className="mx-auto flex max-w-lg items-center">{mobileTabs.map((t) => { const active = location.pathname === t.to; return <Link key={t.to} to={t.to} aria-current={active ? "page" : undefined} className={`flex min-h-16 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-md ${active ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}><SafariIcon name={t.icon} size={20} tone={active ? "active" : "muted"} /><span className="text-[10px] font-medium">{t.label}</span></Link>; })}</div></nav>
    </div>
  );
}
