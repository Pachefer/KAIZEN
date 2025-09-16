export default function ServerComponentLoading() {
  return (
    <section className="content">
      <span className="flag">
        app/components/server-component/loading(.tsx)
      </span>
      <ul id="load">
        {[...new Array(10)].map((item, i) => (
          <li className="loading"></li>
        ))}
      </ul>
    </section>
  );
}
