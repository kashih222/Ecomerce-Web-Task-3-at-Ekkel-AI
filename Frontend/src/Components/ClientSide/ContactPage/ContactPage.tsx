import { useState } from "react";
import { useMutation } from "@apollo/client";
import { SEND_CONTACT_MESSAGE } from "../../../GraphqlOprations/mutation";

interface FormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

const ContactPage = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [sendMessage, { loading }] = useMutation(SEND_CONTACT_MESSAGE);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      await sendMessage({
        variables: {
          contactInput: {
            fullName: formData.fullName,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
          },
        },
      });

      setSuccess("Message sent successfully!");
      setFormData({
        fullName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err: unknown) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send message";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center mt-60">
      <div className="container min-h-screen w-full flex items-center justify-center px-4">
        <div className="container min-h-screen w-full px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* LEFT CONTENT */}
            <div className="hero-content flex flex-col gap-6 md:gap-10 text-center md:text-left">
              <p className="text-3xl md:text-4xl chango-regular">
                Get in Touch
              </p>
              <h1 className="text-4xl md:text-6xl font-bold tracking-widest">
                CONTACT US
              </h1>

              <hr className="w-[50%] md:w-[40%] mx-auto md:mx-0 border-gray-500" />

              <p className="text-xl md:text-2xl major-mono leading-relaxed chango-regular">
                Have questions, feedback, or need support? Our team is always
                here to help.
              </p>

              {/* Contact Info */}
              <div className="mt-4 space-y-3 text-lg md:text-xl chango-regular">
                <p>
                  <strong>Email:</strong> support@kashihstore.com
                </p>
                <p>
                  <strong>Phone:</strong> +92 311 7747393
                </p>
                <p>
                  <strong>Address:</strong> EkkelAI, Gulberg III, Lahore,
                  Pakistan
                </p>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="hero-img relative flex justify-center md:justify-end">
              <div
                className="absolute bg-gray-300 rounded-lg shadow-2xl z-0
                w-50 h-50 sm:w-65 sm:h-65
                md:w-82.5  md:h-82.5 lg:w-125 lg:h-125 
                xl:w-150 xl:h-150 -top-6 md:-top-10 right-6 md:right-20"
              ></div>

              <figure className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1525182008055-f88b95ff7980?w=800&auto=format&fit=crop&q=60"
                  alt="Contact"
                  className="rounded-lg shadow-2xl object-cover
                      w-62.5 sm:w-72.5 md:w-97.5 
                     lg:w-147.5 xl:w-172.5 "
                />
              </figure>
            </div>
          </div>

          <div className="container h-2 w-full bg-black mt-20 md:mt-30 lg:mt-60"></div>

          {/* FORM */}
          <div className="py-20">
            <form
              className="w-full max-w-xl mx-auto bg-gray-100 p-8 rounded-2xl shadow-xl text-black space-y-6"
              onSubmit={handleSubmit}
            >
              {success && (
                <p className="text-green-600 font-semibold">{success}</p>
              )}
              {error && <p className="text-red-600 font-semibold">{error}</p>}

              <div>
                <label className="font-semibold text-lg">Full Name</label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 p-3 rounded-lg border"
                />
              </div>

              <div>
                <label className="font-semibold text-lg">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 p-3 rounded-lg border"
                />
              </div>

              <div>
                <label className="font-semibold text-lg">Subject</label>
                <input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 p-3 rounded-lg border"
                />
              </div>

              <div>
                <label className="font-semibold text-lg">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full mt-2 p-3 rounded-lg border resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-black text-white rounded-lg"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
