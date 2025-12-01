import { useState } from "react";
import axios from "axios";

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

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await axios.post("http://localhost:5000/api/contact/send-message", formData, {
        headers: { "Content-Type": "application/json" },
      });

      setSuccess("Message sent successfully!");
      setFormData({
        fullName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.log(err)
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center mt-60">
      <div className="container min-h-screen w-full flex items-center justify-center px-4">
        <div className="container mx-auto">
          
          
          <div className="py-20">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-xl mx-auto bg-gray-100 p-8 rounded-2xl shadow-xl text-black space-y-6"
            >
              {success && <p className="text-green-600 font-semibold">{success}</p>}
              {error && <p className="text-red-600 font-semibold">{error}</p>}

              <div>
                <label className="font-semibold text-lg">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full mt-2 p-3 rounded-lg border border-gray-300"
                />
              </div>

              <div>
                <label className="font-semibold text-lg">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="w-full mt-2 p-3 rounded-lg border border-gray-300"
                />
              </div>

              <div>
                <label className="font-semibold text-lg">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Enter subject"
                  className="w-full mt-2 p-3 rounded-lg border border-gray-300"
                />
              </div>

              <div>
                <label className="font-semibold text-lg">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Write your message..."
                  rows={5}
                  className="w-full mt-2 p-3 rounded-lg border border-gray-300 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-black text-white text-lg rounded-lg disabled:opacity-50"
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
