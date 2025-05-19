import { redirect } from 'next/navigation';

const HomePage = () => {
  redirect('/posts');
};

export default HomePage;
