import React, { useState } from 'react';
import List from '../Components/List';
import TeacherModal from '../Components/TeacherModal'
import '../Components/Components.css'


const TeachersList = () => {
  const [teachers, setTeachers] = useState([
    { code: 1, name: 'Mr. Red', subject: 'Math', contact: 'green@example.com' },
    { code: 2, name: 'Mrs. Brown', subject: 'Science', contact: 'brown@example.com' },
    { code: 2, name: 'Ms. Green', subject: 'English', contact: 'brown@example.com' },
    { code: 2, name: 'Mr. Yellow', subject: 'Geography', contact: 'brown@example.com' },
    { code: 2, name: 'Mr. White', subject: 'Muslim', contact: 'brown@example.com' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const addTeacher = (newTeacher) => {
    setTeachers([...teachers, newTeacher]);
  };
  return (
    <div className='wrapper'>
      <div className="container">
        <h2>Teachers</h2>
        <button onClick={openModal}>New Teacher</button>
      </div>
      <List items={teachers} fields={['code', 'name', 'subject', 'contact']} />
      <TeacherModal isOpen={isModalOpen} onRequestClose={closeModal} onAddTeacher={addTeacher} />
    </div>
  );
};

export default TeachersList;
