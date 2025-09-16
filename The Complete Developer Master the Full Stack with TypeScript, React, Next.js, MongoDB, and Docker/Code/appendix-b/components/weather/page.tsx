import ClientComponentWeather from "./component";

export const metadata = {
  title: "Appendix C - Client Side Component (Weather & Count)",
  description: "The Example Code For A Client Side Component (Weather & Count)",
};

export default async function WeatherPage() {
  return (
    <section className="content">
      <span className="flag">app/components/weather/page(.tsx)</span>
      <ClientComponentWeather weather="sunny" />
    </section>
  );
}
