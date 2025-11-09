"use client"
import AuthenticatedNavBar from "@/app/components/AuthenticatedNavBar"
import Footer from "@/app/components/Fotter"
import Link from "next/link"
import { motion } from "framer-motion"
import "./about.css"

export default function AboutPage() {
  return (
    <main className="main-container">
      <AuthenticatedNavBar />

      <section className="about-hero bg-gradient-to-br from-blue-100 via-white to-blue-50 py-16">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          >
            About Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
          >
            We’re passionate about building experiences that make online shopping seamless,
            trustworthy, and enjoyable for everyone.
          </motion.p>
        </div>
      </section>

      <section className="about-content py-16 bg-white">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            src="/images/about.png"
            alt="About illustration"
            className="rounded-2xl shadow-lg w-full h-auto"
          />

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Who We Are</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We are a dedicated team of developers, designers, and innovators who believe
              technology can make shopping more human. Our mission is to simplify the buying
              experience and create meaningful connections between brands and customers.
            </p>
            <p className="text-gray-600 leading-relaxed">
              With a strong focus on reliability, speed, and user experience, we continue to
              improve every part of our platform so you can focus on what truly matters — finding
              products you love.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mission-section bg-gray-50 py-16">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-gray-800 mb-6"
          >
            Our Mission
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-gray-600 text-lg"
          >
            To make every online purchase simple, transparent, and delightful — by combining
            modern design, smart technology, and exceptional service.
          </motion.p>
        </div>
      </section>

      <section className="team-section py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { name: "Anjali Mourya", role: "Web Developer", image: "/images/anjali.png" },
              { name: "Rahul Verma", role: "UI/UX Designer", image: "/images/team2.png" },
              { name: "Priya Mehta", role: "Marketing Manager", image: "/images/team3.png" },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-gray-50 rounded-2xl shadow-md p-6 hover:shadow-lg transition"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-28 h-28 mx-auto rounded-full mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section bg-blue-600 text-white py-16 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Join Us on Our Journey</h2>
          <p className="text-lg mb-8">
            We’re always looking for new ideas and people who are passionate about building
            something meaningful.
          </p>
          <Link
            href="/contact"
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition"
          >
            Contact Us
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
