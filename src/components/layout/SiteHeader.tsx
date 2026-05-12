import Link from "next/link";
import { Container } from "./Container";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Container className="site-header__inner">
        <Link className="site-header__brand" href="/" aria-label="Joseph-Paul Marhefka home">
          <span>Joseph-Paul Marhefka</span>
          <span>Project Portfolio</span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <Link href="/#work">Projects</Link>
          <a href="/#contact">Contact</a>
        </nav>
      </Container>
    </header>
  );
}
