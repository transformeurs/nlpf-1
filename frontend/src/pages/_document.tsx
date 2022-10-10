import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
    render() {
        return (
            <Html className="h-full bg-gray-200">
                <Head>
                    <link
                        href="https://fonts.googleapis.com/css?family=Montserrat:100,200,300,400,500,600,700,800,900"
                        rel="stylesheet"
                    />
                    <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
                </Head>
                <body className="h-full">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
