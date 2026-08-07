import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Duda Bambil — Gerenciamento de Pele",
  description: "Esteticista, especialista em gerenciamento de pele.",
  openGraph: {
    title: "Duda Bambil — Gerenciamento de Pele",
    description: "Onde saúde e beleza se completam em equilíbrio.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        {children}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1612355636912285&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/*
          ⚠️ NÃO renomeie estes ids para "clarity" nem "fbq".
          Um elemento com id="X" vira window.X automaticamente (named access no
          window). O snippet do Clarity faz `window.clarity = window.clarity ||
          stub`; se window.clarity já for o próprio <script id="clarity">, o
          stub nunca é criado, o tag da Microsoft quebra em "a[c] is not a
          function" e NENHUM dado é enviado — a instalação nunca é reconhecida.
        */}
        <Script id="ms-clarity" strategy="afterInteractive">{`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window,document,"clarity","script","xr952o1qq5");
        `}</Script>
        <Script id="meta-pixel" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '1612355636912285');
        fbq('track', 'PageView');
        `}</Script>
      </body>
    </html>
  );
}
