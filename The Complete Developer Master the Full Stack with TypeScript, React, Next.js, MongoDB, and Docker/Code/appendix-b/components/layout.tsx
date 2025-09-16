// import Link from "next/link";

export default function ComponentsLayout(props: LayoutProps): JSX.Element {
  return (
    <section>
      <span className="flag">app/components/layout(.tsx)</span>
      <nav>
        Navigation Placeholder
        {/* <Link href="/components/server-component">
                    Server Component <br />
                    (User API)
                </Link>{" "}
                | 
                <Link href="/components/client-component">
                    Client Component <br />
                    (Weather & Count)
                </Link> */}
      </nav>
      <main>{props.children}</main>
    </section>
  );
}
