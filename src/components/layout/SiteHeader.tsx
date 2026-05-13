import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";
import { Container } from "./Container";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Container className="site-header__inner">
        <Link className="site-header__brand" href="/" aria-label="Joseph-Paul Marhefka home">
          <Image
            className="site-header__brand-mark"
            src="/icons/site-icon-192.png"
            alt=""
            width={38}
            height={38}
            priority
          />
          <span className="site-header__brand-copy">
            <span>Joseph-Paul Marhefka</span>
            <span>Project Portfolio</span>
          </span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <div className="site-nav__projects">
            <Link className="site-nav__link" href="/#work">
              Projects
            </Link>
            <div className="site-nav__dropdown" aria-label="Project links">
              {projects.map((project) =>
                project.href ? (
                  <Link className="site-nav__dropdown-item" href={project.href} key={project.id}>
                    <span>{project.title}</span>
                    <small>{project.status}</small>
                  </Link>
                ) : (
                  <span className="site-nav__dropdown-item site-nav__dropdown-item--disabled" key={project.id}>
                    <span>{project.title}</span>
                    <small>{project.status}</small>
                  </span>
                ),
              )}
            </div>
          </div>
          <a href="/#contact">Contact</a>
        </nav>
      </Container>
    </header>
  );
}
