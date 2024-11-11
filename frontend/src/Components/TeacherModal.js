import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const TeacherModal = ({ isOpen, onRequestClose, onAddTeacher }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    class: '',
    contact: '',
    gender: '',
    email: '',
    photo: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTeacher(formData);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Student"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2>Add New Teacher</h2>
      <form onSubmit={handleSubmit}>
        <label>Code: <input type="text" name="index" onChange={handleInputChange} required /></label>
        <label>Name: <input type="text" name="name" onChange={handleInputChange} required /></label>
        <label>Class: <input type="text" name="class" onChange={handleInputChange} required /></label>
        <label>Contact: <input type="tel" name="contact" onChange={handleInputChange} required /></label>
        <label>Email: <input type="email" name="email" onChange={handleInputChange} required /></label>
        <label>Gender: 
          <select name="gender" onChange={handleInputChange} required>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label>Photo: <input type="file" onChange={handleFileChange} /></label>
        <button type="submit" className='btn'>Add Teacher</button>
      </form>
      <button onClick={onRequestClose} className='btn'>Close</button>
    </Modal>
  );
};

export default TeacherModal;
