"use client"
import AuthenticatedNavBar from "@/app/components/AuthenticatedNavBar"
import Footer from "@/app/components/Fotter"
import { motion } from "framer-motion"
import "./terms.css"

export default function TermsPage() {
  return (
    <main className="main-container">
      <AuthenticatedNavBar />

      {/* Hero Section */}
      <section className="terms-hero bg-gradient-to-br from-blue-100 via-white to-blue-50 py-16">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            Terms & Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Please read these Terms and Conditions carefully before using our website and services.
          </motion.p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="terms-content bg-white py-16">
        <div className="container mx-auto px-6 max-w-4xl text-gray-700 leading-relaxed">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold text-gray-800 mb-4"
          >
            1. Acceptance of Terms
          </motion.h2>
          <p className="mb-6">
            By accessing or using our website, you agree to comply with these Terms and Conditions.
            If you do not agree, please do not use our services.
          </p>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl font-semibold text-gray-800 mb-4"
          >
            2. Use of Our Services
          </motion.h2>
          <p className="mb-6">
            You agree to use our website only for lawful purposes. You must not use our platform to
            post or distribute harmful, offensive, or illegal content, or attempt to interfere with
            its operation.
          </p>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl font-semibold text-gray-800 mb-4"
          >
            3. Account Responsibilities
          </motion.h2>
          <p className="mb-6">
            If you create an account with us, you are responsible for maintaining the
            confidentiality of your login credentials and for all activities under your account.
          </p>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-2xl font-semibold text-gray-800 mb-4"
          >
            4. Intellectual Property Rights
          </motion.h2>
          <p className="mb-6">
            All content, design, logos, and materials on this website are owned or licensed by us
            and protected under copyright and trademark laws. You may not copy, reproduce, or
            distribute our materials without permission.
          </p>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-2xl font-semibold text-gray-800 mb-4"
          >
            5. Limitation of Liability
          </motion.h2>
          <p className="mb-6">
            We are not liable for any damages resulting from the use or inability to use our
            website or services. All services are provided “as is” without warranties of any kind.
          </p>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-2xl font-semibold text-gray-800 mb-4"
          >
            6. Termination
          </motion.h2>
          <p className="mb-6">
            We reserve the right to suspend or terminate access to our website if users violate
            these Terms or engage in harmful activities.
          </p>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-2xl font-semibold text-gray-800 mb-4"
          >
            7. Changes to These Terms
          </motion.h2>
          <p className="mb-6">
            We may revise these Terms from time to time. Any updates will be posted on this page,
            and continued use of our services constitutes acceptance of those changes.
          </p>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-2xl font-semibold text-gray-800 mb-4"
          >
            8. Contact Information
          </motion.h2>
          <p>
            For any questions regarding these Terms, please contact us at{" "}
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
