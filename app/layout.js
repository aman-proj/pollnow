import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/providers"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PollNow",
  description: "Real-time polling platform",
};

export default function RootLayout({ children }) {
  return (
     <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      ><Providers>
        <Navbar />

        <main className="pt-20">
          {children}
        </main>
        </Providers>
      </body>
    </html>
  );
}


// import { Geist, Geist_Mono } from "next/font/google"
// import "./globals.css"
// import Navbar from "@/components/Navbar"


// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// })

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// })

// export const metadata = {
//   title: "PollNow",
//   description: "Real-time polling platform",
// }

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50`}
//       >
//         <Providers>
//           <Navbar />
//           <main className="pt-20">
//             {children}
//           </main>
//         </Providers>
//       </body>
//     </html>
//   )
// }