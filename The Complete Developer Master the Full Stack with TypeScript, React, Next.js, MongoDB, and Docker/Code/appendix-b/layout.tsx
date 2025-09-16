import "./globals.css";

export const metadata = {
  title: "Appendix C",
  description: "The Example Code",
};

export default function RootLayout(props: LayoutProps): JSX.Element {
  return (
    <html lang="en">
      <body>
        <section>
          <span className="flag">app/layout(.tsx)</span>
          {props.children}
        </section>
      </body>
    </html>
  );
}
