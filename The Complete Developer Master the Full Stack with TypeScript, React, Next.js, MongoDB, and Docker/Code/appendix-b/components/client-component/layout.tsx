export default function ClientComponentLayout(props: LayoutProps): JSX.Element {
  return (
    <section>
      <span className="flag">app/components/client-component/layout(.tsx)</span>
      {props.children}
    </section>
  );
}
