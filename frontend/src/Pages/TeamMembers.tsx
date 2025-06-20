import React, { useEffect, useState, type FormEvent } from 'react';
import Header from '../Components/Header';
import axios from 'axios';

interface TeamMember {
  id: number;
  name: string;
  email: string;
}

const TeamMembers: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<Partial<TeamMember>>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Partial<TeamMember>>({});

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const res = await axios.get<TeamMember[]>('/api/users');
    setMembers(res.data);
  };

  const openAddModal = () => {
    setCurrentMember({});
    setIsEditMode(false);
    setModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setCurrentMember(member);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleDeleteModal = (member: TeamMember) => {
    setDeleteTarget(member);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    await axios.delete(`/api/users/${deleteTarget.id}`);
    setDeleteModalOpen(false);
    fetchMembers();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const method = isEditMode ? 'put' : 'post';
    const url = isEditMode ? `/api/users/${currentMember.id}` : '/api/users';

    await axios[method](url, currentMember);
    setModalOpen(false);
    fetchMembers();
  };

  return (
    <>
      <Header isHome={false} />

      <div className="container mx-auto text-white" style={{ paddingTop : '135px' }}>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-blue-500 pb-4">
          <h2 className="text-3xl font-semibold">Team Members</h2>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2 mt-4 md:mt-0 cursor-pointer"
            onClick={openAddModal}
          >
            Add Team Member
          </button>
        </div>

        <div className="relative overflow-x-auto rounded-lg shadow">
          <table className="w-full text-sm text-center text-gray-300">
            <thead className="text-xs uppercase bg-gray-900 text-gray-400">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody style={{ background: '#0c1220' }}>
              {/* {members.map((member) => (
                <tr key={member.id} className="border-b">
                  <td className="px-6 py-4">{member.name}</td>
                  <td>{member.email}</td>
                  <td className="py-4">
                    <button
                      className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 rounded-s-lg"
                      onClick={() => openEditModal(member)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-e-lg"
                      onClick={() => handleDeleteModal(member)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))} */}
              {/* {members.length === 0 && ( */}
              <tr>
                <td colSpan={3} className="py-6 text-gray-500">
                  No team member found.
                </td>
              </tr>
            {/* )} */}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Modal */}
        {modalOpen && (
          <div
            className="fixed inset-0 z-50 backdrop-blur-sm flex justify-center items-center"
            onClick={(e) => e.target === e.currentTarget && handleModalClose()}
          >
            <div className="text-white bg-[#161f30] rounded-xl shadow-2xl w-full max-w-xl animate-fade-in">
              <div className="flex justify-between items-center rounded-xs border-b border-blue-700 px-6 py-4">
                <h5 className="text-2xl font-semibold">{isEditMode ? 'Edit Team Member' : 'Add Team Member'}</h5>
                <button className="text-blue-400 hover:text-red-600 text-2xl font-bold cursor-pointer" onClick={handleModalClose}>&times;</button>
              </div>
             
              <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-gray-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={currentMember.name || ''}
                    onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
                    className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-[#1a2238] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={currentMember.email || ''}
                    onChange={(e) => setCurrentMember({ ...currentMember, email: e.target.value })}
                    className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-[#1a2238] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                {!isEditMode && (
                  <div>
                    <label className="block text-gray-400 mb-1">Password</label>
                    <input
                      type="password"
                      onChange={(e) => setCurrentMember({ ...currentMember, password: e.target.value } as Partial<TeamMember>)}
                      className="w-full border border-gray-600 rounded-lg px-3 py-2 bg-[#1a2238] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                )}
                <div className="flex justify-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="bg-gray-200 text-gray-700 font-semibold rounded-lg px-4 py-2 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-800 text-white font-semibold rounded-lg px-4 py-2 cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div
            className="fixed inset-0 z-50 backdrop-blur-sm flex justify-center items-center"
            onClick={(e) => e.target === e.currentTarget && setDeleteModalOpen(false)}
          >
            <div className="text-white bg-[#161f30] rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
              <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
              <p className="mb-6">
                Are you sure you want to delete{' '}
                <strong>{deleteTarget.name}</strong>?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  className="bg-gray-200 text-gray-700 font-semibold rounded-lg px-4 py-2"
                  onClick={() => setDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 hover:bg-red-800 text-white font-semibold rounded-lg px-4 py-2"
                  onClick={handleDelete}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>

  );
};

export default TeamMembers;