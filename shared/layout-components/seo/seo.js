import Head from "next/head";

const Seo = ({ title }) => {

  let i = `${title} | H&B`;

  return (
    <Head>
      <title>{i}</title>
      <link href={`/favicon.ico`} rel="icon"></link>
      <meta name="description" content="Synto - Nextjs Admin &amp; Dashboard Template" />
      <meta name="author" content="Spruko Technologies Private Limited" />
      <meta name="keywords" content="tailwind nextjs, dashboard tailwind, tailwind admin, nextjs tailwind, tailwind in nextjs, admin dashboard tailwind, tailwind dashboards, tailwind template admin, tailwind and nextjs, admin panel, template dashboard, admin dashboard template, admin panel template"></meta>

    </Head>
  );
};

export default Seo;
