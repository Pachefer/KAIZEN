export default function WeatherLayout(props: LayoutProps): JSX.Element {
  return (
    <section>
      <span className="flag">app/components/weather/layout(.tsx)</span>
      {props.children}
    </section>
  );
}
