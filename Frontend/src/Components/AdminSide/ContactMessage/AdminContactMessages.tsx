/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface ContactMessage {
  _id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: string;
}

interface ApiAllMessagesResponse {
  messages: ContactMessage[];
}

interface ApiSingleMessageResponse {
  message: ContactMessage;
}

const AdminContactMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // NEW: delete confirmation modal
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:5000/api/contact";

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get<ApiAllMessagesResponse>(`${API_BASE}/all-messages`);
        setMessages(data.messages);
      } catch (error) {
        toast.error("Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Fetch a single message
  const openMessage = async (id: string): Promise<void> => {
    try {
      const { data } = await axios.get<ApiSingleMessageResponse>(`${API_BASE}/message/${id}`);
      setSelectedMessage(data.message);
      setModalOpen(true);
    } catch (error) {
      toast.error("Error fetching message");
    }
  };

  // Delete message WITH CONFIRMATION MODAL
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await axios.delete(`${API_BASE}/delete/${deleteId}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== deleteId));
      toast.success("Message deleted successfully");
    } catch {
      toast.error("Error deleting message");
    }

    setDeleteId(null); 
  };

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading messages...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Subject</th>
              <th className="p-4 font-semibold">Message</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-600">
                  No messages found.
                </td>
              </tr>
            ) : (
              messages.map((msg) => (
                <tr key={msg._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{msg.fullName}</td>
                  <td className="p-4">{msg.email}</td>
                  <td className="p-4">{msg.subject}</td>
                  <td className="p-4">{msg.message}</td>

                  <td className="p-4 flex gap-3">
                    <button
                      onClick={() => openMessage(msg._id)}
                      className="px-4 py-2 bg-black text-white rounded-lg hover:scale-95"
                    >
                      View
                    </button>

                    <button
                      onClick={() => setDeleteId(msg._id)}   // OPEN CONFIRM MODAL
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:scale-95"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Message Modal */}
      {modalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[500px] shadow-xl">
            <h2 className="text-xl font-bold mb-4">Message Details</h2>

            <p><strong>Name:</strong> {selectedMessage.fullName}</p>
            <p><strong>Email:</strong> {selectedMessage.email}</p>
            <p><strong>Subject:</strong> {selectedMessage.subject}</p>

            <p className="mt-3 whitespace-pre-line">
              <strong>Message:</strong><br />
              {selectedMessage.message}
            </p>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2 bg-black text-white rounded-lg hover:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[380px] rounded-xl p-6 shadow-xl">
            <h3 className="text-xl font-bold mb-3">Delete Message?</h3>
            <p className="text-black mb-6">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-black rounded-lg hover:scale-95 text-white"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminContactMessages;
