export default function ServerComponentLayout(props: LayoutProps): JSX.Element {
  return (
    <section>
      <span className="flag">app/components/server-component/layout(.tsx)</span>
      {props.children}
    </section>
  );
}
