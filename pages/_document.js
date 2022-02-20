import Document, { Main, Head, NextScript, Html } from "next/document";


class MyDocument extends Document{
    render(){
        return (
            <Html>
                <Head>
                    <link
                     rel="preload"
                     href="/fonts/LobsterTwo-Bold.ttf"
                     as="font"
                     crossOrigin="anonymous"></link>
                    <link
                     rel="preload"
                     href="/fonts/LobsterTwo-BoldItalic.ttf"
                     as="font"
                     crossOrigin="anonymous"></link>
                    <link
                     rel="preload"
                     href="/fonts/LobsterTwo-Italic.ttf"
                     as="font"
                     crossOrigin="anonymous"></link>
                    <link
                     rel="preload"
                     href="/fonts/LobsterTwo-Regular.ttf"
                     as="font"
                     crossOrigin="anonymous"></link>
                </Head>
                <body>
                   <Main></Main>
                   <NextScript/>
                </body>
            </Html>
        )
    }
}

export default MyDocument; 