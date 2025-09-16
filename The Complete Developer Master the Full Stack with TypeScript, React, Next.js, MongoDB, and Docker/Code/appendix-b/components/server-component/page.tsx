import ServerComponentUserList from "./component";

export const metadata = {
  title: "Appendix C - Server Side Component (User API)",
  description: "The Example Code For A Server Side Component (User API)",
};

export default async function ServerComponentUserListPage() {
  return (
    <section className="content">
      <span className="flag">app/components/server-component/page(.tsx)</span>
      {/* @ts-expect-error Async Server Component */}
      <ServerComponentUserList myprop="foo" />
    </section>
  );
}
