import { useUser } from './UserContext';

const SomeComponent = () => {
  const { user } = useUser();

  const handleSomeAction = () => {
    if (user) {
      const userId = user.id;
      // Use userId as needed
    }
  };

  // ...
};
