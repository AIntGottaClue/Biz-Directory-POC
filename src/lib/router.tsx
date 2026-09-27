import { cityForPath, cityPath, isCityContent } from '@/data/cities';
import React, { forwardRef, useEffect, createContext, useContext } from 'react';
const RouteContext = createContext('/');
export const RouteProvider = RouteContext.Provider;
export function useCity() { return cityForPath(useContext(RouteContext)); }
export function localPath(to: string, currentPath: string) {
  if (!to.startsWith('/') || to.startsWith('//')) return to;
  // Existing absolute paths in views are rewritten only for city content.
  if (to !== '/' && !isCityContent(to)) return to;
  return cityPath(cityForPath(currentPath).slug, to);
}

export type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string; end?: boolean };
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ to, end, ...props }, ref) => <a href={localPath(to, useContext(RouteContext))} ref={ref} {...props} />);
Link.displayName = 'Link';
export type NavLinkProps = Omit<LinkProps, 'className'> & { className?: string | ((state: {isActive: boolean; isPending: boolean}) => string) };
export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(({ to, end, className, ...props }, ref) => {
  const path = useContext(RouteContext);
  const target = localPath(to, path);
  const isActive = path === target || (!end && target !== '/' && path.startsWith(target + '/'));
  return <a href={localPath(to, useContext(RouteContext))} ref={ref} className={typeof className === 'function' ? className({isActive, isPending:false}) : className} {...props} />;
});
NavLink.displayName = 'NavLink';
export function useNavigate() { const path = useContext(RouteContext); return (to: string) => { window.location.assign(localPath(to, path)); }; }
export function useParams<T extends Record<string, string>>() {
  const parts = useContext(RouteContext).split('/');
  return { slug: decodeURIComponent(parts[parts.length - 1] || '') } as unknown as T;
}
export function useLocation() { return { pathname: useContext(RouteContext) }; }
export function useSearchParams(): [URLSearchParams, (params: URLSearchParams) => void] {
  const [params, setParams] = React.useState(() => new URLSearchParams());
  useEffect(() => { setParams(new URLSearchParams(window.location.search)); }, []);
  return [params, (next) => window.location.assign('?' + next.toString())];
}
export function Navigate({to}: {to:string; replace?:boolean}) { const path = useContext(RouteContext); useEffect(() => {window.location.replace(localPath(to, path))}, [to, path]); return null; }
