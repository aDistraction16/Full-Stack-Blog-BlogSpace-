import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PostCard from './PostCard';

const mockPost = {
  id: 1,
  title: 'Test Post',
  content: 'Test content for the post',
  author: { username: 'testuser' },
  created_at: '2024-01-01T12:00:00Z',
  comments_count: 5
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

test('renders post card with correct information', () => {
  renderWithRouter(<PostCard post={mockPost} />);
  
  expect(screen.getByText('Test Post')).toBeInTheDocument();
  expect(screen.getByText('testuser')).toBeInTheDocument();
  expect(screen.getByText(/Test content/)).toBeInTheDocument();
});

test('shows read more button', () => {
  renderWithRouter(<PostCard post={mockPost} />);
  
  expect(screen.getByText('📖 Read More')).toBeInTheDocument();
});