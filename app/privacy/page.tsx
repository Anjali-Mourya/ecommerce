"use client"
import AuthenticatedNavBar from "@/app/components/AuthenticatedNavBar"
import Footer from "@/app/components/Fotter"
import { motion } from "framer-motion"
import "./privacy.css"

export default function PrivacyPolicyPage() {
  return (
    <main className="main-container">
      <AuthenticatedNavBar />

      {/* Hero Section */}
      <section className="privacy-hero bg-gradient-to-br from-blue-100 via-white to-blue-50 py-16">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Your privacy matters to us. Learn how we collect, use, and protect your information.
          </motion.p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="privacy-content bg-white py-16">
        <div className="container mx-auto px-6 max-w-4xl text-gray-700 leading-relaxed">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold text-gray-800 mb-4"
          >
            1. Information We Collect
          </motion.h2>
          <p className="mb-6">
            We collect personal information such as your name, email address, and other details
            you provide when you create an account, make a purchase, or contact us. We may also
            collect non-personal information like browser type, device information, and usage
            data for analytics and improvements.
          </p>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl font-semibold text-gray-800 mb-4"
          >
            2. How We Use Your Information
          </motion.h2>
          <p className="mb-6">
            Your data helps us provide, improve, and personalize our services. We use it to process
            transactions, send updates, respond to inquiries, and enhance user experience. We may
            also use data for analytics and security purposes.
          </p>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl font-semibold text-gray-800 mb-4"
          >
            3. Sharing of Information
          </motion.h2>
          <p className="mb-6">
            We do not sell or rent your personal information. However, we may share data with
            trusted partners who help us operate our website and services, provided they agree to
            keep your information confidential.
          </p>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-2xl font-semibold text-gray-800 mb-4"
          >
            4. Cookies & Tracking Technologies
          </motion.h2>
          <p className="mb-6">
            We use cookies and similar technologies to enhance user experience, analyze trends, and
            track website performance. You can control cookie preferences through your browser
            settings.
          </p>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-2xl font-semibold text-gray-800 mb-4"
          >
            5. Data Security
          </motion.h2>
          <p className="mb-6">
            We implement appropriate security measures to protect your personal data from
            unauthorized access, alteration, or disclosure. However, no online platform can
            guarantee absolute security.
          </p>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-2xl font-semibold text-gray-800 mb-4"
          >
            6. Your Rights
          </motion.h2>
          <p className="mb-6">
            You have the right to access, update, or delete your personal data. You may also opt
            out of promotional communications at any time by contacting us.
          </p>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-2xl font-semibold text-gray-800 mb-4"
          >
            7. Updates to This Policy
          </motion.h2>
          <p className="mb-6">
            We may update our Privacy Policy from time to time. All changes will be posted on this
            page with the updated date.
          </p>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-2xl font-semibold text-gray-800 mb-4"
          >
            8. Contact Us
          </motion.h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:support@yourwebsite.com" className="text-blue-600 underline">
              support@yourwebsite.com
            </a>
            .
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
