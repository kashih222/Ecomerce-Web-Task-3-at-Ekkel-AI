import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Dialog, Transition } from "@headlessui/react";

interface User {
  _id: string;
  fullname: string;
  email: string;
  role: string;
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>("");

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE}api/auth/fetch-all/all-users`
      );
      setUsers(res.data.users);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const confirmDeleteUser = (id: string) => {
    setSelectedUserId(id);
    setIsDeleteModalOpen(true);
  };

  // Delete user
  const deleteUser = async () => {
    if (!selectedUserId) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE}api/auth/delete/delete-user/${selectedUserId}`
      );
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedUserId(null);
    }
  };

  // Open update role modal
  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsRoleModalOpen(true);
  };

  // Update user role
  const updateRole = async () => {
    if (!selectedUser) return;
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE}api/auth/update/update-role/${selectedUser._id}`,
        { role: newRole }
      );
      toast.success("User role updated successfully!");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update role");
    } finally {
      setIsRoleModalOpen(false);
      setSelectedUser(null);
    }
  };

  if (loading) return <p className="text-center p-5">Loading users...</p>;

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Role</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center border-b">
                <td className="p-2 border font-medium">{user.fullname}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">
                  {user.role === "admin" ? (
                    <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                      Admin
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                      Customer
                    </span>
                  )}
                </td>
                <td className="p-2  flex gap-2 justify-center">
                  <button
                    onClick={() => openRoleModal(user)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit Role
                  </button>
                  <button
                    onClick={() => confirmDeleteUser(user._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                    Delete User
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this user? This action
                      cannot be undone.
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={deleteUser}
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Update Role Modal */}
      <Transition appear show={isRoleModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsRoleModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                    Update Role
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-2">
                      Update the role of the user:
                      <span className="font-semibold ml-1">
                        {selectedUser?.fullname}
                      </span>
                    </p>

                    <select
                      className="w-full border rounded p-2"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      onClick={() => setIsRoleModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={updateRole}
                    >
                      Save
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default AdminUsersPage;
