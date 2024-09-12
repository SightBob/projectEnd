import React, { useState, useEffect } from 'react';
import ContactList from './ContactList';
import Chat from './Chat';

const ChatContainer = ({ onClose, selectedContactId }) => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedContactId) {
      fetchContactById(selectedContactId);
    }
  }, [selectedContactId]);

  const fetchContactById = async (uid) => {
    try {
      const response = await fetch(`/api/profile?uid=${uid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch contact');
      }
      const data = await response.json();
      console.log("Fetched contact data:", data);
      setSelectedContact(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching contact:", err);
      setError("Failed to load contact");
    }
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
  };

  const handleBack = () => {
    setSelectedContact(null);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (selectedContact) {
    return <Chat contact={selectedContact} onBack={handleBack} onClose={onClose} />;
  }
  
  return <ContactList contacts={contacts} onSelectContact={handleSelectContact} onClose={onClose} />;
};

export default ChatContainer;