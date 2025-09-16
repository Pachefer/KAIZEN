import type { NextPage } from "next";
import Head from "next/head";

const Hello: NextPage = () => {
    return (
        <div>
            <Head>
                <title>Hello World Page Title</title>
                <meta property="og:title" content="Hello World" key="title" />
            </Head>
            <div>Hello World!</div>
        </div>
    );
};

export default Hello;
