import React, { useState } from "react";
import { toast } from "react-toastify";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import {
  GET_CONTACT_MESSAGES,
  GET_SINGLE_MESSAGE,
} from "../../../GraphqlOprations/queries";
import { DELETE_CONTACT_MESSAGE } from "../../../GraphqlOprations/mutation";

interface ContactMessage {
  _id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string | number;
}

interface GetContactMessagesData {
  getContactMessages: ContactMessage[];
}

interface GetSingleMessageData {
  getContactMessageById: ContactMessage;
}

const AdminContactMessages: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // GraphQL Queries
  const { data, loading, error, refetch } =
    useQuery<GetContactMessagesData>(GET_CONTACT_MESSAGES);

  const [
    fetchSingleMessage,
    { data: singleMessageData, loading: singleMessageLoading },
  ] = useLazyQuery<GetSingleMessageData>(GET_SINGLE_MESSAGE, {
    onCompleted: (data) => {
      if (data?.getContactMessageById) {
        setModalOpen(true);
      }
    },
    onError: (error) => {
      toast.error(`Error fetching message: ${error.message}`);
    },
    fetchPolicy: "network-only",
  });

  //  Mutations
  const [deleteContactMessage, { loading: deleteLoading }] = useMutation(
    DELETE_CONTACT_MESSAGE,
    {
      onCompleted: () => {
        toast.success("Message deleted successfully");
        setDeleteId(null);
        refetch();
      },
      onError: (error) => {
        toast.error(`Error deleting message: ${error.message}`);
        setDeleteId(null);
      },
    }
  );

  const messages = data?.getContactMessages || [];
  const selectedMessage = singleMessageData?.getContactMessageById;

  const openMessage = async (messageId: string): Promise<void> => {
    try {
      await fetchSingleMessage({
        variables: { messageId },
      });
    } catch (error) {
      console.error("Error fetching message:", error);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteContactMessage({
        variables: { messageId: deleteId },
      });
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading messages...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20 text-xl text-red-600">
        Error loading messages: {error.message}
      </div>
    );
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
              <th className="p-4 font-semibold">Message Preview</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-6 text-gray-600">
                  No messages found.
                </td>
              </tr>
            ) : (
              messages.map((msg) => (
                <tr key={msg._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{msg.fullName}</td>
                  <td className="p-4">{msg.email}</td>
                  <td className="p-4">{msg.subject}</td>
                  <td className="p-4 max-w-xs truncate">{msg.message}</td>
                  <td className="p-4">
  {msg.createdAt ? (
    (() => {
      const timestamp = typeof msg.createdAt === 'string' 
        ? parseInt(msg.createdAt) 
        : msg.createdAt;
      
      const date = new Date(timestamp);
      return isNaN(date.getTime()) 
        ? "Invalid Date" 
        : date.toLocaleString();
    })()
  ) : "N/A"}
</td>

                  <td className="p-4 flex gap-3">
                    <button
                      onClick={() => openMessage(msg._id)}
                      disabled={singleMessageLoading}
                      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {singleMessageLoading ? "Loading..." : "View"}
                    </button>

                    <button
                      onClick={() => setDeleteId(msg._id)}
                      disabled={deleteLoading}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Modal for viewing message */}
      {modalOpen && selectedMessage && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Message Details</h2>

            <div className="space-y-2 mb-4">
              <p>
                <strong>Name:</strong> {selectedMessage.fullName}
              </p>
              <p>
                <strong>Email:</strong> {selectedMessage.email}
              </p>
              <p>
                <strong>Subject:</strong> {selectedMessage.subject}
              </p>
              {selectedMessage.createdAt && (
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              )}
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg max-h-60 overflow-y-auto">
              <strong className="block mb-2">Message:</strong>
              <p className="whitespace-pre-line">{selectedMessage.message}</p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => !deleteLoading && setDeleteId(null)}
        >
          <div
            className="bg-white w-full max-w-sm rounded-xl p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-3">Delete Message?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this message? This action cannot
              be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => !deleteLoading && setDeleteId(null)}
                disabled={deleteLoading}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContactMessages;
