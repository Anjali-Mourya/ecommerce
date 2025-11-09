import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { AuthProvider } from "../lib/auth"

export const metadata: Metadata = {
  title: "ShopEase - Premium Shopping Experience",
  description: "Modern ecommerce platform with authentication, payments, and order tracking",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
