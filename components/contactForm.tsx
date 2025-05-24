"use client";
import React, { useState } from 'react'
import { useForm, SubmitHandler, FieldValues, FormProvider } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage, FormField } from './ui/form'
import { motion } from "framer-motion"; // Add this import

function ContactForm() {
  const [success, setSuccess] = useState(false)
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess(true)
        form.reset();
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch {
      alert('An error occurred. Please try again.');
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ amount: 0.1, once: true }}
    >
      {success && (
        <div className="bg-gradient-to-b from-white via-gray-50 to-gray-600 dark:from-gray-700 dark:via-gray-950 dark:to-gray-900 px-4 py-3 rounded mb-4 mt text-center">
          Your message has been submitted successfully!
        </div>
      )}
      <FormProvider {...form}>
        <div className="max-w-lg mx-auto bg-gradient-to-b from-white via-gray-50 to-gray-400 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 rounded-xl shadow-lg p-8 mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-700 dark:text-gray-400">Contact Me</h2>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* ...existing form fields... */}
            <FormField
              control={form.control}
              rules={{ required: "Name is required" }}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <input
                      className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <input
                      type="email"
                      className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              rules={{ required: "Subject is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <input
                      className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Subject"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
                rules={{ required: "Message is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <textarea
                      className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px]"
                      placeholder="Type your message..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-md bg-cyan-400 text-neutral-950 font-semibold transition hover:bg-cyan-600 cursor-pointer"
            >
              Submit Message
            </button>
          </form>
        </div>
      </FormProvider>
    </motion.div>
  )
}

export default ContactForm