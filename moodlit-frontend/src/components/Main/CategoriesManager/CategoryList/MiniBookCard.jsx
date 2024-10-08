import React from 'react';
import './CategoryList.css';

const MiniBookCard = ({ book, onClick }) => {
  return (
    <div className="mini-book-card" onClick={onClick}>
      <div 
        className="book-cover" 
        style={{ backgroundImage: `url(${book.cover})` }}
      >
        <div className="book-title">
          <span>{book.title}</span>
        </div>
      </div>
    </div>
  );
};

export default MiniBookCard;