"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";

const contactSchema = z.object({
  about: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required").max(200, "Subject is too long"),
  description: z
    .string()
    .min(10, "Please provide at least 10 characters")
    .max(5000, "Description is too long"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm(): React.JSX.Element {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { about: "", email: "", subject: "", description: "" },
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: data,
      });
      if (error) throw error;
      toast.success("Message sent. We'll get back to you soon.");
      reset();
    } catch (err) {
      console.error("Contact form submit error:", err);
      const message =
        err instanceof Error ? err.message : "Failed to send message. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto" noValidate>
      <div>
        <label htmlFor="about" className="block text-sm font-medium text-brand-dark-alt mb-2">
          Tell us about you
        </label>
        <select
          id="about"
          {...register("about")}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
        >
          <option value="">-</option>
          <option value="General Inquiry">General Inquiry</option>
          <option value="Booking Help">Booking Help</option>
          <option value="Billing Issue">Billing Issue</option>
          <option value="Feedback">Feedback</option>
        </select>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-brand-dark-alt mb-2">
          Your email address
        </label>
        <input
          type="email"
          id="email"
          {...register("email")}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
        />
        {errors.email && (
          <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-brand-dark-alt mb-2">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          {...register("subject")}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
        />
        {errors.subject && (
          <p className="text-xs text-red-600 mt-1">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-brand-dark-alt mb-2">
          Description
        </label>
        <textarea
          id="description"
          rows={6}
          {...register("description")}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
        />
        {errors.description && (
          <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Button variant="terracotta" size="lg" type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  );
}
